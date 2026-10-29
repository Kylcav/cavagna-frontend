import { HttpTypes } from "@medusajs/types"
import { clx } from "@medusajs/ui"
import React from "react"

type OptionSelectProps = {
  option: HttpTypes.StoreProductOption
  current: string | undefined
  updateOption: (title: string, value: string) => void
  title: string
  disabled: boolean
  "data-testid"?: string
}

const OptionSelect: React.FC<OptionSelectProps> = ({
  option,
  current,
  updateOption,
  title,
  "data-testid": dataTestId,
  disabled,
}) => {
  const filteredOptions = (option.values ?? []).map((v) => v.value)

  return (
    <div className="flex flex-col gap-y-3">
      <div className="flex items-baseline gap-x-2">
        <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[#8a6f55]">
          {title}
        </span>
        {current && (
          <span className="text-sm font-medium text-[#171412]">{current}</span>
        )}
      </div>

      <div className="flex flex-wrap gap-2" data-testid={dataTestId}>
        {filteredOptions.map((v) => {
          const isSelected = v === current
          return (
            <button
              onClick={() => updateOption(option.id, v)}
              key={v}
              className={clx(
                "whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-all duration-150 ease-out",
                {
                  "border-[#171412] bg-[#171412] text-white shadow-sm":
                    isSelected,
                  "border-black/15 bg-white text-[#2b2b24] hover:border-[#171412]/50 hover:-translate-y-0.5":
                    !isSelected,
                  "cursor-not-allowed opacity-40": disabled,
                }
              )}
              disabled={disabled}
              data-testid="option-button"
            >
              {v}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default OptionSelect
