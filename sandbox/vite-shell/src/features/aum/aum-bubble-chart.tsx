import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import Highcharts from "highcharts"
import "highcharts/highcharts-more"
import HighchartsReact from "highcharts-react-official"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@one-brd-test/ui"

import { formatCurrency } from "./aum-data"
import type { AumBubblePoint, AumPopoverState } from "./types"

interface AumBubblePointOptions extends Highcharts.PointOptionsObject {
  custom: {
    bubblePoint: AumBubblePoint
  }
}

interface AumBubbleChartProps {
  points: AumBubblePoint[]
}

function resolveCssVariable(variableName: string): string {
  if (typeof window === "undefined") {
    return "#0b49ea"
  }

  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(variableName)
    .trim()

  return value || "#0b49ea"
}

function toSeriesPoint(point: AumBubblePoint): AumBubblePointOptions {
  return {
    x: point.x,
    y: point.y,
    z: point.z,
    color: resolveCssVariable(point.colorToken),
    custom: {
      bubblePoint: point,
    },
  }
}

export function AumBubbleChart({ points }: AumBubbleChartProps) {
  const [popoverState, setPopoverState] = useState<AumPopoverState | null>(null)
  const closeTimerRef = useRef<number | null>(null)
  const chartRef = useRef<HighchartsReact.RefObject>(null)
  const isApplyingLayoutRef = useRef(false)

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
  }, [])

  const hidePopover = useCallback(() => {
    clearCloseTimer()
    setPopoverState(null)
  }, [clearCloseTimer])

  const schedulePopoverClose = useCallback(() => {
    clearCloseTimer()
    closeTimerRef.current = window.setTimeout(() => {
      setPopoverState(null)
    }, 90)
  }, [clearCloseTimer])

  const handlePointMouseOver = useCallback((point: Highcharts.Point) => {
    clearCloseTimer()

    const pointOptions = point.options as AumBubblePointOptions
    const bubblePoint = pointOptions.custom?.bubblePoint

    if (!bubblePoint || point.plotX === undefined || point.plotY === undefined) {
      return
    }

    const chart = point.series.chart
    setPopoverState({
      point: bubblePoint,
      anchorX: chart.plotLeft + point.plotX,
      anchorY: chart.plotTop + point.plotY,
    })
  }, [clearCloseTimer])

  useEffect(() => {
    return () => {
      clearCloseTimer()
    }
  }, [clearCloseTimer])

  const seriesData = useMemo(
    () => points.map((point) => toSeriesPoint(point)),
    [points]
  )

  useEffect(() => {
    const chart = chartRef.current?.chart
    if (!chart) {
      return
    }

    const frameId = window.requestAnimationFrame(() => {
      if (isApplyingLayoutRef.current) {
        return
      }

      const xAxis = chart.xAxis[0]
      const yAxis = chart.yAxis[0]
      const series = chart.series[0]
      if (!xAxis || !yAxis || !series) {
        return
      }

      const chartPoints = series.points.filter((point) => point && !(point as { isNull?: boolean }).isNull)
      if (chartPoints.length <= 1) {
        return
      }

      const layoutPoints = chartPoints.map((point) => {
        const radius = Math.max(50, Number((point as any).marker?.radius ?? 50))
        const xPx = xAxis.toPixels(point.x as number, true)
        const yPx = yAxis.toPixels(point.y as number, true)
        return {
          point,
          radius,
          x: xPx,
          y: yPx,
          targetX: xPx,
          targetY: yPx,
        }
      })

      const minX = 0
      const maxX = chart.plotWidth
      const minY = 0
      const maxY = chart.plotHeight
      const collisionGap = 0.5

      for (let iteration = 0; iteration < 240; iteration += 1) {
        for (let i = 0; i < layoutPoints.length; i += 1) {
          for (let j = i + 1; j < layoutPoints.length; j += 1) {
            const a = layoutPoints[i]
            const b = layoutPoints[j]
            if (!a || !b) {
              continue
            }

            const dx = b.x - a.x
            const dy = b.y - a.y
            const distance = Math.hypot(dx, dy) || 0.001
            const targetDistance = a.radius + b.radius + collisionGap

            if (distance < targetDistance) {
              const overlap = targetDistance - distance
              const ux = dx / distance
              const uy = dy / distance
              const push = overlap * 0.5

              a.x -= ux * push
              a.y -= uy * push
              b.x += ux * push
              b.y += uy * push
            }
          }
        }

        for (const item of layoutPoints) {
          item.x += (item.targetX - item.x) * 0.012
          item.y += (item.targetY - item.y) * 0.012
          item.x = Math.min(maxX - item.radius, Math.max(minX + item.radius, item.x))
          item.y = Math.min(maxY - item.radius, Math.max(minY + item.radius, item.y))
        }
      }

      isApplyingLayoutRef.current = true
      for (const item of layoutPoints) {
        item.point.update({
          x: xAxis.toValue(item.x, true),
          y: yAxis.toValue(item.y, true),
        }, false)
      }
      chart.redraw(false)
      isApplyingLayoutRef.current = false
    })

    return () => {
      window.cancelAnimationFrame(frameId)
    }
  }, [points])

  const options = useMemo<Highcharts.Options>(() => {
    return {
      chart: {
        type: "bubble",
        backgroundColor: "transparent",
        animation: false,
        spacing: [0, 0, 0, 0],
        margin: [0, 0, 0, 0],
        style: {
          fontFamily: "var(--font-family-brand)",
        },
      },
      title: { text: undefined },
      credits: { enabled: false },
      legend: { enabled: false },
      tooltip: { enabled: false },
      xAxis: {
        visible: false,
        min: 0,
        max: 100,
      },
      yAxis: {
        visible: false,
        min: 0,
        max: 100,
        reversed: true,
      },
      plotOptions: {
        series: {
          animation: false,
          stickyTracking: true,
          opacity: 1,
          states: {
            hover: {
              enabled: false,
            },
            inactive: {
              opacity: 1,
            },
          },
          point: {
            events: {
              mouseOver: function () {
                handlePointMouseOver(this as Highcharts.Point)
              },
            },
          },
        },
        bubble: {
          minSize: 100,
          maxSize: 280,
          sizeBy: "area",
          marker: {
            lineWidth: 0,
            fillOpacity: 1,
          },
          dataLabels: {
            enabled: true,
            useHTML: true,
            allowOverlap: true,
            formatter: function () {
              const pointOptions = ((this as unknown as { point?: Highcharts.Point }).point?.options ?? {}) as AumBubblePointOptions
              const bubblePoint = pointOptions.custom?.bubblePoint

              if (!bubblePoint) {
                return ""
              }

              const textToneClass = bubblePoint.labelTone === "light"
                ? "aum-bubble-label-light"
                : "aum-bubble-label-dark"

              const secondaryLine = bubblePoint.secondaryLabel
                ? `<span class=\"aum-bubble-secondary\">${bubblePoint.secondaryLabel}</span>`
                : ""

              return [
                `<div class=\"aum-bubble-label ${textToneClass}\">`,
                `<span>${bubblePoint.label}</span>`,
                secondaryLine,
                `<span>${bubblePoint.displayValue}</span>`,
                "</div>",
              ].join("")
            },
          },
        },
      },
      series: [
        {
          type: "bubble",
          data: seriesData,
        },
      ],
    }
  }, [handlePointMouseOver, schedulePopoverClose, seriesData])

  const anchorStyle = {
    left: `${popoverState?.anchorX ?? 0}px`,
    top: `${popoverState?.anchorY ?? 0}px`,
  }

  return (
    <section className="aum-chart-panel" onMouseLeave={schedulePopoverClose}>
      <div className="aum-bubble-chart-container" onMouseEnter={clearCloseTimer}>
        <HighchartsReact
          ref={chartRef}
          highcharts={Highcharts}
          options={options}
          containerProps={{ className: "aum-highcharts-host" }}
        />

        <div className="aum-chart-popover-anchor" style={anchorStyle}>
          <Popover open={Boolean(popoverState)} onOpenChange={(open) => !open && hidePopover()}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="aum-popover-trigger"
                tabIndex={-1}
                aria-hidden="true"
              />
            </PopoverTrigger>
            <PopoverContent
              side="top"
              align="center"
              sideOffset={14}
              size="S"
              className="aum-bubble-popover"
            >
              {popoverState && (
                <div className="aum-bubble-popover-content">
                  <div className="aum-bubble-popover-title-row">
                    <span
                      className="aum-bubble-popover-dot"
                      style={{ backgroundColor: resolveCssVariable(popoverState.point.colorToken) }}
                    />
                    <span className="aum-bubble-popover-title">{popoverState.point.label}</span>
                  </div>
                  <div className="aum-bubble-popover-value-row">
                    <span className="aum-bubble-popover-label">Total Value</span>
                    <span className="aum-bubble-popover-value">{formatCurrency(popoverState.point.value)}</span>
                  </div>
                </div>
              )}
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </section>
  )
}
