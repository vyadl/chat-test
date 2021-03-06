<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    />
    <v-content>
      <v-container
        class="chat-wrap"
        fluid
      >
        <v-row class="chat-window">
          <ul
            ref="chatWindow"
            class="chat-list"
          >
            <li
              class="chat-item"
              v-for="(message, index) in toChat"
              :key="index" 
              :class="message.owner"
            >
              <vue-typed-js
                :showCursor="false"
                :strings="[message.text]"
                @onComplete="checkNext"
                v-if="message.owner === 'him'"
              >
                <span class="typing"></span>
              </vue-typed-js>
              <template v-else>
                {{ message.text }}
              </template>
            </li>

          </ul>
        </v-row>
        <v-row class="message-wrap">
          <v-col cols="12" md="12">
            <v-textarea
              filled
              label="Type your message"
              ref="textarea"
              v-model="userMessage"
            />
          </v-col>
          <v-col cols="12" md="12">
            <div class="my-2">
              <v-btn
                @click="send"
                x-large
                class="send-btn"
                color="primary"
                :disabled="chatFinished"
              >{{toChat.length ? 'Send Message' : 'Let\'s chat!'}}</v-btn>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Chat',
  beforeMount() {
    axios.get('http://localhost:8080/data/botMessages.json').then(({ data }) => {
      this.messages = data;
      this.botTalk();
    })
  },
  data: () => ({
    answers: {
      name: '',
      age: 0,
      location: '',
      feeling: '',
      hobby: '',
    },
    lastTopic: '',
    next: 0,
    userMessage: '',
    messages: [],
  }),
  computed: {
    toChat() {
      return this.messages.slice(0, this.next);
    },
    chatFinished() {
      return !Object.values(this.answers).some(answer => answer === '');
    },
    isBotFinished() {
      return Boolean(this.messages[this.next - 1] && this.messages[this.next - 1].ask);
    },
  },
  methods: {
    checkNext() {
      if (!this.isBotFinished) {
        setTimeout(this.botTalk, 300);
      }
    },
    send() {
      if (this.userMessage !== '') {
        this.messages.splice(this.next, 0, {
          text: this.userMessage,
          owner: 'me',
        });

        if (this.lastTopic !== '') {
          this.answers[this.lastTopic] = this.userMessage;
        }

        this.userMessage = '';
        this.showNextMessage();
        setTimeout(this.botTalk, 500);
      }
    },
    botTalk() {
      const topic = this.messages[this.next] && this.messages[this.next].ask;

      this.showNextMessage();

      if (typeof topic !== 'undefined' || !this.messages[this.next]) {
        this.lastTopic = topic;
      }

      if (!this.chatFinished && this.isBotFinished) {
        this.$refs.textarea.focus();
      }
    },
    showNextMessage() {
      this.next += 1;
      this.$nextTick(() => {
        this.$refs.chatWindow.scrollTop = this.$refs.chatWindow.scrollHeight;
      });
    },
  }
};
</script>

<style lang="scss">
  .chat-wrap {
    height: 90vh;
  }

  .chat-window {
    height: 50%;
    position: relative;
  }

  .chat-list {
    list-style: none;
    margin: 0;
    padding: 0;
    position: absolute;
    left: 0;
    right: 0;
    overflow-y: scroll;
    scroll-behavior: smooth;
    height: 100%;
    z-index: 0;
    padding-bottom: 20px;
  }

  .chat-item {
    display: inline-block;
    clear: both;
    border-radius: 30px;
    margin-bottom: 2px;
    padding: 20px;
    font-family: Helvetica, Arial, sans-serif;
    transition: border-radius .2s;
  }

  .message-send {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 10px;
    z-index: 100;
    height: 50%;
    background: #fff;
  }

  .send-btn {
    position: absolute;
    bottom: 0;
    right: 0;
    background: #56c8d8;
    margin: 0 auto;
    display: block;
  }

  .him {
    background: #eee;
    float: left;
    & + .me {
      border-bottom-right-radius: 5px;
    }
  }

  .me {
    float: right;
    background: #0084ff;
    color: #fff;
    & + .me {
      border-top-right-radius: 5px;
      border-bottom-right-radius: 5px;
    }
    &:last-of-type {
      border-bottom-right-radius: 30px;
    }
  }
</style>
