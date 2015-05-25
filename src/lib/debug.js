var charm = require('charm')();

var position = 30;
module.exports = function(text: string): void {
  if(position === 50) {
    position = 30;
    charm.erase('down');
  }
  charm.position(0, position);
  charm.foreground('red')
  charm.write('debug: ' + text);

  position++;
}
