import { ChatbotService } from "src/app/servicios/chatbot.service";

import { Component } from '@angular/core';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})

export class ChatbotComponent {

  ngOnInit() {
  this.list_msg.push({ from: 'bot', text: 'Hola, ¿cómo puedo ayudarte?' });
  }

  msg = '';
  list_msg: { from: 'user' | 'bot', text: string }[] = [];

  constructor(private service_send_message: ChatbotService) {}

  public send_message() {
    const message = this.msg.trim();
    if (!message) return;
    debugger;
    this.list_msg.push({ from: 'user', text: message });
    this.service_send_message.getData(message).then((response) => { //revisar que devuelve
      console.log('Respuesta del bot:', response);
      const botReply = response?.message?.content || 'Sin respuesta';
      this.list_msg.push({ from: 'bot', text: botReply });
    }).catch(() => {
      debugger;
      this.list_msg.push({ from: 'bot', text: 'Error al procesar el mensaje.' });
    });

    this.msg = '';
  }
}
