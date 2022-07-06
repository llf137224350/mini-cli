const Spinner = require('cli-spinner').Spinner;

/**
 * 终端动画
 * @param msg 提示文本
 * @param spinnerStr 动画内容
 * @returns {Spinner}
 */
function startSpinner(msg = 'cloning...', spinnerStr = '|/-\\') {
  const spinner = new Spinner(`${msg} %s`);
  spinner.setSpinnerString(spinnerStr);
  spinner.start();
  return spinner;
}

module.exports = startSpinner;
