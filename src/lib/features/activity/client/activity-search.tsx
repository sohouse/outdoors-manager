import { Button } from "@/lib/components/ui/button"
import { Resolver, useForm } from "react-hook-form"
import z from "zod"
import { activityConditionCheck } from "../shared/activity-check"
import { zodResolver } from "@hookform/resolvers/zod"
import FormTextField from "@/lib/components/web/form-field/FormInputField"
import FormSelectField from "@/lib/components/web/form-field/FormSelectField"
import { ActivityStatus, ActivityTypes } from "../shared/activity"
import { defaultActivityCondition, useActivityStore } from "../shared/activity-store"
import { DEFAULT_LIMIT, DEFAULT_PAGE } from "@/lib/constants"

const ActivitySearchBar = () => {
  type SearchFormOutput = z.output<typeof activityConditionCheck>;
  const form = useForm<SearchFormOutput>({
    resolver: zodResolver(activityConditionCheck) as Resolver<SearchFormOutput>,
    defaultValues: {
      author: "",
      title: "",
      start_time: "",
      end_time: "",
      type: undefined,
      status: undefined,
    }
  })
  const {setCondition, setPageRefresh} = useActivityStore();

  const searchActivity = (data: SearchFormOutput) => {
    setCondition({
      ...defaultActivityCondition,
      ...data,
      page: DEFAULT_PAGE,
      limit: DEFAULT_LIMIT,
    });
    setPageRefresh();
  }

  const resetSearch = () => {
    form.reset({
      author: "",
      title: "",
      start_time: "",
      end_time: "",
      type: undefined,
      status: undefined,
    });
    setCondition(defaultActivityCondition);
    setPageRefresh();
  }

  return (
    <div>
      <form
        id="activity-search-form"
        onSubmit={form.handleSubmit(searchActivity)}
        className="flex flex-row justify-between w-full gap-6"
      >
        <FormTextField<SearchFormOutput>
          control={form.control}
          name='author'
          label='author'
          className='w-fit editable-field min-w-20'
          showTitle={false}
        />
        <FormTextField<SearchFormOutput>
          control={form.control}
          name='title'
          label='title'
          className='w-fit editable-field min-w-20'
          showTitle={false}
        />
        <FormSelectField<SearchFormOutput>
          label='type'
          name='type'
          control={form.control}
          entries={ActivityTypes}
          showTitle={false}
        />
        <FormSelectField<SearchFormOutput>
          label='status'
          name='status'
          control={form.control}
          entries={ActivityStatus}
          showTitle={false}
        />
        <FormTextField<SearchFormOutput>
          control={form.control}
          name='start_time'
          label='start time'
          type='datetime-local'
          className='w-fit editable-field'
          showTitle={false}
        />
        <FormTextField<SearchFormOutput>
          control={form.control}
          name='end_time'
          label='end time'
          type='datetime-local'
          className='w-fit editable-field'
          showTitle={false}
        />

        <Button type="submit">
          搜索
        </Button>
        <Button type="button" variant="outline" onClick={resetSearch}>
          重置
        </Button>
      </form>
    </div>
  )
}

export default ActivitySearchBar
