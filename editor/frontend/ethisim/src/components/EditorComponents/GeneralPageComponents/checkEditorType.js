// The options are 'TextEditor' or 'CodeEditor'
// '<!--CodeEditor-->' tag in string means the page is designed using the CodeEditor
export default function checkEditorType(body) {
  // Used to differentiate between Code Editor and Text Editor format
  let formattedBody = body;
  let option = 'TextEditor';
  if (body.slice(body.length - 17) === '<!--CodeEditor-->') {
    formattedBody = formattedBody.slice(0, body.length - 17);
    option = 'CodeEditor';
  }
  return { formattedBody, option };
}
