export const bindThis = (_this, methods) => {
	methods.map(item => _this[item] = _this[item].bind(_this));
}

export const decodeHtml = html => {
  let txt = document.createElement("textarea")
  txt.innerHTML = html
  return txt.value
}

export const shuffleArr = arr => arr
  .map(a => [Math.random(), a])
  .sort((a, b) => a[0] - b[0])
  .map(a => a[1]);

export const calcPerc = (input, total) => {
	return Math.ceil(input * 100 / total)
}