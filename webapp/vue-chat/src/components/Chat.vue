<template>
    <div class="chat">
        <input type="text" placeholder="请输入你的昵称" v-model="nickName">
        <div id="content">
        	<p v-for="item in content">
        		speaker: {{item.speaker}}, says: {{item.message}}
        	</p>
        </div>
        <input type="text" v-model="msg" />
        <button @click="send()">send!</button>
    </div>
</template>
<script>
export default {
    name: 'chat',
    data() {
        return {
            msg: '',
            content: [],
            nickName: ''
        }
    },
    methods: {
    	send() {
    		this.ws.send(JSON.stringify({
    			speaker: this.nickName,
    			message: this.msg
    		}))
    		this.msg = ''
    	},
    	init() {
    		this.ws = new WebSocket(`ws://${location.hostname}:8181`)
    		this.ws.onopen = (e) => {
    		    console.log('Connection to server opened')
    		}
    		this.ws.onmessage = (e) => {
    		    // console.log(e)
    		    var data = JSON.parse(e.data)
    		    this.content.push(data)
    		}
    	}
    },
    created() {
    	this.init()
    }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#content {
    width: 500px;
    height: 500px;
    border: black solid 1px;
    overflow: scroll;
}
</style>
