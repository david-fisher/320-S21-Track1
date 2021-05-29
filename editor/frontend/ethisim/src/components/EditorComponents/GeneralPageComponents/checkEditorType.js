export default function checkEditorType(body) {
  // Used to differentiate between Code Editor and Text Editor format
  let initialBody = body;
  let option = 'TextEditor';
  if (body.slice(body.length - 17) === '<!--CodeEditor-->') {
    initialBody = initialBody.slice(0, body.length - 17);
    option = 'CodeEditor';
  }
  return { initialBody, option };
}
