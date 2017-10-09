class Config {
  constructor() {
    this.config = {}
  }

  get(key) {
    return this.config[key]
  }

  set(key, value) {
    this.config[key] = value
  }

  delete(key) {
    delete this.config[key]
  }
}