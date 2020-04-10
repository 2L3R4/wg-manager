import { Component, EventEmitter, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Server } from '../../../interfaces/server';
import { ServerService } from '../../../services/server.service';
import { DataService } from '../../../services/data.service';
import { Peer } from '../../../interfaces/peer';

@Component({
  selector: 'app-server',
  templateUrl: './server.component.html',

  styleUrls: ['./server.component.scss', '../dashboard.component.css'],
})
export class ServerComponent implements OnInit {
  @Input() server: Server;
  @Input() servers: Server[];
  public editPeerEmitter: EventEmitter<any> = new EventEmitter<any>();

  selectedPeer: Peer | null;

  constructor(private serverAPI: ServerService, private comm: DataService) { }

  ngOnInit(): void {
    console.log('Server');
  }

  edit() {

    this.comm.emit('server-edit', this.server);
  }

  stop() {
    this.serverAPI.stopServer(this.server).subscribe((apiServer) => {
      this.server.is_running = apiServer.is_running;
    });
  }

  start() {
    this.serverAPI.startServer(this.server).subscribe((apiServer) => {
      this.server.is_running = apiServer.is_running;
    });
  }

  addPeer() {
    this.serverAPI.addPeer({
      server_interface: this.server.interface
    }).subscribe((peer) => {
      this.server.peers.push(peer);
    });
  }

  restart() {
    this.serverAPI.restartServer(this.server).subscribe((apiServer) => {
      this.server.is_running = apiServer.is_running;
    });
  }

  delete() {
    const index = this.servers.indexOf(this.server);
    this.serverAPI.deleteServer(this.server).subscribe((apiServer) => {
      this.servers.splice(index, 1);
    });
  }

  openPeer(peer: Peer) {
    if (this.selectedPeer == peer) {
      this.selectedPeer = null;
      return;
    }
    this.selectedPeer = peer;
    this.editPeerEmitter.emit({ type: 'open', peer });
  }
  pInt(string: string) {
    return parseInt(string);
  }
}