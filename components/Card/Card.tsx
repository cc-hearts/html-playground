import { defineComponent } from 'vue'
import { usePrefixCls } from '@/hooks'
import '@/assets/scss/components/card.scss'

export default defineComponent({
  name: 'Card',
  setup(_, { slots }) {
    const cardCls = usePrefixCls('card')

    return () => {
      const defaultTitle = slots.title ? (
        <div class={`${cardCls}__title p-1.5`}>{slots.title()}</div>
      ) : null

      return (
        <div class={`h-full rounded-md ${cardCls}`}>
          {defaultTitle}
          <div class="h-full w-full">{slots.default?.()}</div>
        </div>
      )
    }
  },
})
