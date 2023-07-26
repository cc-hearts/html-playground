import { Splitpanes, Pane } from 'splitpanes'
import { Ref, computed, defineComponent, onMounted, reactive, ref } from 'vue'
import '@/assets/scss/components/playground/playground.scss'
import CodeMirror from '@/components/codeMirror/index.vue'
import Preview from './preview'
import Card from '@/components/Card/Container'
import Add from '@/icons/add.vue'
import { transFormCode } from './compileApi'
import { useDebounce } from '@/hooks/useDebounce'
export default defineComponent({
  name: 'Playground',
  setup() {
    const entry = 'app.js'
    const html = ref('')
    const isAddScriptVisible = ref(false)
    const style = ref('')
    const scriptModule = reactive(new Map())
    scriptModule.set(entry, `// ${entry}`)
    const currentPage = ref(entry)
    const handleChange = (event: string, refs: Ref<string>) => {
      refs.value = event
    }
    const script = computed(() => {
      return scriptModule.get(currentPage.value) || ''
    })

    const scriptNames = computed(() => [...scriptModule.keys()])
    const compileModule = ref({})

    const handleChangeCompileModule = useDebounce(async () => {
      const newCode = await transFormCode(Object.fromEntries(scriptModule))
      compileModule.value = newCode
    }, 500)
    const handleChangeScripts = async (event: string) => {
      scriptModule.set(currentPage.value, event)
      handleChangeCompileModule()
    }

    const handleBlur = (event: FocusEvent) => {
      isAddScriptVisible.value = false
      let value: string = Reflect.get(event.target || {}, 'value')
      if (value) {
        if (!value.endsWith('.js')) {
          value += '.js'
        }
        scriptModule.set(value, `// ${value}`)
      }
    }

    const handleChangeCurrentScripts = (name: string) => {
      currentPage.value = name
    }

    onMounted(() => {
      handleChangeCompileModule()
    })

    return () => (
      <div class="p-3 w-full h-full">
        <Splitpanes class="default-theme">
          <Pane>
            <Splitpanes class="default-theme" horizontal>
              <Pane>
                <Card v-slots={{ title: () => 'html' }}>
                  <CodeMirror
                    value={html.value}
                    lang="html"
                    onChange={(e) => handleChange(e, html)}
                  />
                </Card>
              </Pane>
              <Pane>
                <Card
                  v-slots={{
                    title: () => (
                      <div class="flex items-center">
                        <div>
                          {scriptNames.value.map((val) => {
                            return (
                              <span
                                onClick={() => handleChangeCurrentScripts(val)}
                                class={`script-tag ${
                                  currentPage.value === val
                                    ? 'active-script'
                                    : ''
                                }`}
                              >
                                {val}
                              </span>
                            )
                          })}
                        </div>
                        {isAddScriptVisible.value && (
                          <input
                            autofocus
                            class="add-script-tag"
                            onBlur={handleBlur}
                          ></input>
                        )}
                        <Add
                          onClick={() => (isAddScriptVisible.value = true)}
                        />
                      </div>
                    ),
                  }}
                >
                  <CodeMirror
                    value={script.value}
                    onChange={(e) => handleChangeScripts(e)}
                  />
                </Card>
              </Pane>
              <Pane>
                <Card v-slots={{ title: () => 'style' }}>
                  <CodeMirror
                    value={style.value}
                    lang="css"
                    onChange={(e) => handleChange(e, style)}
                  />
                </Card>
              </Pane>
            </Splitpanes>
          </Pane>
          <Pane>
            <Card v-slots={{ title: () => 'output' }}>
              <Preview
                compileModule={compileModule.value}
                entry={entry}
                html={html.value}
                style={style.value}
              />
            </Card>
          </Pane>
        </Splitpanes>
      </div>
    )
  },
})
