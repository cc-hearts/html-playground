import * as monaco from 'monaco-editor'

export function setupAutoTagClose(
  monacoInstance: monaco.editor.IStandaloneCodeEditor,
) {
  const model = monacoInstance.getModel()
  if (model?.getLanguageId() === 'html') {
    monacoInstance.onKeyUp((event) => {
      if (event.browserEvent.key === '>') {
        const currentSelections = monacoInstance.getSelections()
        const edits: Array<monaco.editor.IIdentifiedSingleEditOperation> = []
        const newSelections: Array<monaco.Selection> = []
        if (currentSelections === null) return
        for (const selection of currentSelections) {
          const contentBeforeChange = model.getValueInRange({
            startLineNumber: 1,
            startColumn: 1,
            endLineNumber: selection.endLineNumber,
            endColumn: selection.endColumn,
          })

          const matcher = contentBeforeChange.match(/<([^<]*?)>$/)
          if (matcher && matcher.length > 0) {
            edits.push({
              range: {
                startLineNumber: selection.endLineNumber,
                startColumn: selection.endColumn + 1,
                endLineNumber: selection.endLineNumber,
                endColumn: selection.endColumn + 1,
              },
              text: `</${matcher[1]}>`,
            })

            newSelections.push(
              new monaco.Selection(
                selection.endLineNumber,
                selection.endColumn, // 设置光标位置在闭合标签内部
                selection.endLineNumber,
                selection.endColumn,
              ),
            )
          }
        }

        setTimeout(() => {
          monacoInstance.executeEdits(model.getValue(), edits, newSelections)
        }, 0)
      }
    })
  }
}
