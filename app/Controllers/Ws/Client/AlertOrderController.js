'use strict'

class AlertOrderController {
  constructor ({ socket, request }) {
    this.socket = socket
    this.request = request
  }
  onMessage (message) {
    this.socket.broadcast('message', message)
  }

  noClose(){
    this.socket.broadcastToAll('drop:connection')
  }
}

module.exports = AlertOrderController
