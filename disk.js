// Allow storing objects in localstorage (from http://stackoverflow.com/questions/2010892/storing-objects-in-html5-localstorage)
Storage.prototype.setObject = function(key, value) { this.setItem(key, JSON.stringify(value)); }
Storage.prototype.getObject = function(key) { var value = this.getItem(key); return value && JSON.parse(value); }

export const disk = {
  get saved() {
    return localStorage.getObject('game');
  },

  save(game) {
    localStorage.setObject('game', game);
  },

  save_for_prop(prop, value) {
    let game = this.saved;
    game[prop] = value;
    this.save(game);
  }
}