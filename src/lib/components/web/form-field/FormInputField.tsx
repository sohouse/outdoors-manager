import { Control, Controller, FieldValues, Path } from "react-hook-form"
import { Field, FieldError, FieldLabel } from "../../ui/field"
import { Input } from "../../ui/input"

type FormTextFieldProps<T extends FieldValues> = {
  control: Control<T>
  name: Path<T>
  label: string
  className?: string
  type?: React.HTMLInputTypeAttribute
  showTitle?: boolean
}

function FormTextField<T extends FieldValues>({
  control,
  name,
  label,
  className,
  type = 'text',
  showTitle = true
}: FormTextFieldProps<T>) {
  return (
    <>
      {showTitle && <FieldLabel>{label}</FieldLabel>}
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => (
          <Field>
            <Input
              {...field}
              type={type}
              value={field.value ?? ''}
              onChange={(e) => field.onChange(e.target.value)}
              className={className}
              placeholder={label}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </>
  )
}

export default FormTextField