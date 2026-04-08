import { Control, Controller, FieldValues, Path } from "react-hook-form"
import { Field, FieldError, FieldLabel } from "../../ui/field"
import { Textarea } from "../../ui/textarea"

type FormTextareaFieldProps<T extends FieldValues> = {
  control: Control<T>
  name: Path<T>
  label: string
  className?: string
}

function FormTextareaField<T extends FieldValues>({
  control,
  name,
  label,
  className,
}: FormTextareaFieldProps<T>) {
  return (
    <>
      <FieldLabel>{label}</FieldLabel>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => (
          <Field>
            <Textarea
              {...field}
              value={field.value ?? ''}
              onChange={(e) => field.onChange(e.target.value)}
              className={className}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </>
  )
}

export default FormTextareaField