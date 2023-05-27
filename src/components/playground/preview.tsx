import { defineComponent, watch, ref } from "vue";
import "@/assets/scss/components/playground/preview.scss";
import { useDebounce } from "@/hooks/useDebounce";
export default defineComponent({
  name: "Preview",
  props: {
    html: {
      type: String,
      default: "",
    },
    script: {
      type: String,
      default: "",
    },
    style: {
      type: String,
      default: "",
    },
  },
  setup(props) {
    const srcDoc = ref("");
    const updateSrcDoc = useDebounce(() => {
      srcDoc.value = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <link rel="icon" type="image/svg+xml" href="/vite.svg" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>test</title>
          <style>
            ${props.style}
          </style>
        </head>
        <body>
          <div id="app">
            ${props.html}
          </div>
          <script>
            ${props.script}
          </script>
        </body>
      </html>
    `;
    });
    watch([() => props.html, () => props.script, () => props.style], () => {
      updateSrcDoc();
    });
    return () => (
      <div class="preview w-full h-full">
        <iframe class="w-full h-full" srcdoc={srcDoc.value} />
      </div>
    );
  },
});
