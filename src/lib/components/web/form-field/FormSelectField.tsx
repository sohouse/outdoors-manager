import { Control, Controller, FieldValues, Path } from "react-hook-form"
import { Field, FieldLabel } from "../../ui/field"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../../ui/select"

type FormTextareaFieldProps<T extends FieldValues> = {
  control: Control<T>
  name: Path<T>
  label: string
  className?: string
  entries: Record<string, string | number>
  showTitle?: boolean
}

function FormSelectField<T extends FieldValues>({
  control,
  name,
  label,
  className,
  entries,
  showTitle = true
}: FormTextareaFieldProps<T>) {
  return (
    <>
      {showTitle && <FieldLabel>{label}</FieldLabel>}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Field>
            <Select
              value={field.value == null ? "" : field.value.toString()}
              onValueChange={(value) => field.onChange(Number(value))}
            >
              <SelectTrigger className={className}>
                <SelectValue placeholder={label} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {Object.entries(entries)
                    .filter(([key]) => !isNaN(Number(key)))
                    .map(([key, value]) => (
                      <SelectItem value={key} key={key}>
                        {value}
                      </SelectItem>
                    ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
        )}
      />
    </>
  )
}

export default FormSelectField
