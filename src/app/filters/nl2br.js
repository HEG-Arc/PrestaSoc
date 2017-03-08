export function nl2br() {
  return (text = '') => {
    return text.replace(/\n/g, '<br/>');
  };
}
