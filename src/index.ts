import { Context, Session, Schema } from 'koishi'
import { WebSocket } from 'ws'

import {} from '@koishijs/plugin-console'
import { link } from 'fs';
import { count, log } from 'console';

export interface Config{
  head_Self_ID: string;
  head_Websocket_Version: string;
  head_Websocket_key: string;
  head_User_Agent: string;
  head_host: string;
  head_get: string;
  head_Authorization: string;
  head_x_client_role: string;
  head_Content: string;

  log_msg: boolean;
  log_all: boolean;
  log_ct: boolean;
  area: string;
  ports: number;
  link: string;
  test_QQnumber: string;
  test_QQbot_id: string;
  timeout: number;
  keepalive: boolean;
  openalive: boolean;
  openall:boolean;

  line: string;
}

export const Config: Schema<Config> = Schema.intersect([
  Schema.object({
      area: Schema.string()
      .role('textarea',{rows:[5, 5]})
      .default('测试\nceshi')
      .description('介绍'),
  }).description('说明'),
      
  Schema.object({
      ports: Schema.number()
      .default(2280)
      .description('进行测试链接**测试**端口'),
  }).description('连接测试'),

  Schema.object({
      link: Schema.string()
      .default('ws://127.0.0.1:2280/ws')  
      .role('link')
      .description('Websocket连接地址'),
      line: Schema.string()
      .default('ws://127.0.0.1:2290/api')
      .role('line')
      .description('line连接地址'),
      timeout: Schema.number()
      .description('最长等待时间'),
      keepalive: Schema.boolean()
      .description('是否持续保持连接')
      .default(true),
      openalive: Schema.boolean()
      .description('是否对地址进行连接')
  }).description('连接设置'),

  Schema.object({
      head_get: Schema.string()
      .default('GET /ws HTTP/1.1')
      .deprecated()
      .description('get请求'),
      head_Self_ID: Schema.string()
      .required()
      .description('Bot ID(QQ号)'),
      head_Authorization: Schema.string()

      .default('Bearer ')
      .deprecated()
      .description('Authorization'),
      head_x_client_role: Schema.string()

      .default('Universal')
      .deprecated()
      .description('x-client-role'),
      head_Websocket_Version: Schema.string()
      .default('13')

      .deprecated()
      .description('Websocket版本'),
      head_Websocket_key: Schema.string()
      .role('secret')
      .required()
      .description('Websocket key'),
      head_User_Agent: Schema.string()
      .default('onebot/11')
      .experimental()
      // .default('onebot/11')
      .description('User-Agent'),
      head_Content: Schema.string()

      .deprecated()
      .default('Upgrade')
      .description('Content'),
      head_host: Schema.string()

      .experimental()
      .default('127.0.0.1:2280')
      .role('link')
      .description('host')
  }).description('连接消息头'),

  Schema.object({
      test_QQnumber: Schema.string()
      .default('2724743928"/>')
      .description('BotQQ号'),
      test_QQbot_id: Schema.string()
      .description('Bot名称(@名称)')

  }).description('bot设置'),

  Schema.object({
    log_all: Schema.boolean()
    .default(false)
    .experimental()
    .description('调试日志显示'),
    log_msg: Schema.boolean()
    .default(false)
    .description('消息交换显示')
    .experimental(),
    openall: Schema.boolean()
    .default(false)
    .description('转发全部消息(QQ群内不@也接收时打开)'),
  }).description('日志调试'),

  Schema.object({
    log_ct: Schema.boolean()
   .default(true)
   .description('控制台日志')
   .experimental()
  }).description('控制台日志')
])

export const name = 'langbot-connect-koishi'

export function apply(ctx: Context, config: Config) {
  const ws=ctx.http.ws(config.link,{
    headers: {
      'X-Self-ID': config.head_Self_ID,
      'Authorization': 'Authorization',
      'x-Client-Role': 'Universal',
      'user-agent': config.head_User_Agent,
      'Sec-Websocket-Version': '13',
      'sec-websocket-key': config.head_Websocket_key,
      'Connection':'Upgrade',
      'Upgrade': 'websocket',
      'Host': config.head_host,
    }
  })

  const wws=ctx.http.ws(config.line)

  if(config.log_msg ==true){
    console.log(new Date(),'\x1b[36m[langbot_connect_koishi]\x1b[33m接收配置\x1b[0m ','管理员QQ号:',config.test_QQbot_id)
    console.log(new Date(),'\x1b[36m[langbot_connect_koishi]\x1b[33m接收配置\x1b[0m ','Bot QQ 群聊消息头:',config.test_QQbot_id)
  }

  if(config.log_ct ==true){
    ctx.logger.info('\x1b[33m接收配置\x1b[0m ','管理员QQ号:',config.test_QQbot_id)
    ctx.logger.info('\x1b[33m接收配置\x1b[0m ','Bot QQ 群聊消息头:',config.test_QQbot_id)
  }

    let Data:any

      ws.addEventListener('open',() =>{
        ctx.on('message',(session: Session) =>{

          let commands: boolean = true;
          ctx.middleware((session, Next) =>{
            if(session.content ===''){
              commands = false;
            }
              return Next();
          })
        

          if(session.guildId == undefined ){
            //ession.guildId == undefined私聊
            if(config.log_msg ==true){
              console.log(new Date(),'\x1b[36m[langbot_connect_koishi]\x1b[33mget message\x1b[0m ','\x1b[32mmessage id:\x1b[0m',session.messageId,' \x1b[32mmessage:\x1b[0m',session.content)
              console.log(new Date(),'\x1b[36m[langbot_connect_koishi]\x1b[33mget message\x1b[0m ','\x1b[32mmessage id:\x1b[0m',session.messageId,' \x1b[32mmessage come from:\x1b[0m',"\x1b[35muser\x1b[0m",' \x1b[32m come from:\x1b[0m',session.userId)
            }
          }
          else{
            if(config.log_msg ==true){
              console.log(new Date(),'\x1b[36m[langbot_connect_koishi]\x1b[33mget message\x1b[0m ','\x1b[32mmessage id:\x1b[0m',session.messageId,' \x1b[32mmessage:\x1b[0m',session.content)
              console.log(new Date(),'\x1b[36m[langbot_connect_koishi]\x1b[33mget message\x1b[0m ','\x1b[32mmessage id:\x1b[0m',session.messageId,' \x1b[32mmessage come from:\x1b[0m',"\x1b[35mgroup\x1b[0m",' \x1b[32m come from:\x1b[0m',session.userId)
            }
          }
          let meg_mix:string = "[CQ:at,qq="+session.selfId+"]"+session.content
          const all_group = {
            "stringMsg":{
              "self_id":session.selfId,
              "user_id":session.userId,
              "time":session.timestamp,
              "message_id":session.messageId,
              "message_seq":session.messageId,
              "real_id":session.messageId,
              "message_type":session.messageId,
              "sender":{
                      "user_id":session.selfId,
                      "nickname":session.username,
                      "card":"",
                      "role":session.roleId
                },
                "raw_message":meg_mix,
                "font":14,
                "sub_type":"normal",
                "message":meg_mix,
                "message_format":"string",
                "post_type":"message",
                "group_id":session.guildId
            },
            "arrayMsg":{
                "self_id":session.selfId,
                "user_id":session.userId,
                "time":session.timestamp,
                "message_id":session.messageId,
                "message_seq":session.messageId,
                "real_id":session.messageId,
                "message_type":"group",
                "sender":{
                  "user_id":session.userId,
                  "nickname":session.username,
                  "card":session.username,
                  "role":"admin"
                  },
                "raw_message":meg_mix,
                "font":14,
                "sub_type":"normal",
                "message":[{
                    "type":"at",
                    "data":{"qq":session.selfId}
                },
                        {
                    "type":"text",
                    "data":{"text":session.content}
                }],
                "message_format":"array",
                "post_type":"message",
                "group_id":session.guildId
            }
        }
          const part_group = {
            "stringMsg":{
                  "self_id":session.selfId,
                  "user_id":session.userId,
                  "time":session.timestamp,
                  "message_id":session.messageId,
                  "message_seq":session.messageId,
                  "real_id":session.messageId,
                  "message_type":session.messageId,
                  "sender":{
                      "user_id":session.selfId,
                      "nickname":session.username,
                      "card":"",
                      "role":session.roleId
                      },
                  "raw_message":session.content,
                  "font":14,
                  "sub_type":"normal",
                  "message":session.content,
                  "message_format":"string",
                  "post_type":"message",
                  "group_id":session.guildId
                  },
              "arrayMsg":{
                  "self_id":session.selfId,
                  "user_id":session.userId,
                  "time":session.timestamp,
                  "message_id":session.messageId,
                  "message_seq":session.messageId,
                  "real_id":session.messageId,
                  "message_type":"group",
                  "sender":{
                      "user_id":session.userId,
                      "nickname":session.username,
                      "card":session.username,
                      "role":"admin"
                      },
                  "raw_message":session.content,
                  "font":14,
                  "sub_type":"normal",
                  "message":[{
                      "type":"text",
                      "data":{
                          "text":session.content
                      }
                  }],
                  "message_format":"array",
                  "post_type":"message",
                  "group_id":session.guildId
              }
          }
          
          const user = {
            "stringMsg":{
              "self_id":session.selfId,
              "user_id":session.userId,
              "time":session.timestamp,
              "message_id":session.messageId,
              "message_seq":session.messageId,
              "real_id":session.messageId,
              "message_type":"private",
              "sender":{
                "user_id":session.userId,
                "nickname":session.username,
                "card":session.username
              },
              "raw_message":session.content,
              "font":14,
              "sub_type":"friend",
              "message":session.content,
              "message_format":"string",
              "post_type":"message"},
            "arrayMsg":{
              "self_id":session.selfId,
              "user_id":session.userId,
              "time":session.timestamp,
              "message_id":session.messageId,
              "message_seq":session.messageId,
              "real_id":session.messageId,
              "message_type":"private",
              "sender":{
                  "user_id":session.userId,
                  "nickname":session.username,
                  "card":""
              },
              "raw_message":session.content,
              "font":14,
              "sub_type":"friend",
              "message":[{
                  "type":"text",
                  "data":{"text":session.content}
              }],
              "message_format":"array",
              "post_type":"message"
            }
          }
          if(session.guildId != undefined){
            //session.guildId == undefined 私聊消息
            
            if(session.content.includes(config.test_QQnumber)){
              ws.send(JSON.stringify(all_group.stringMsg))
              console.log(new Date(),'\x1b[36m[langbot_connect_koishi]\x1b[33msend message')
            }else{
              if(config.openall ==true){
                ws.send(JSON.stringify(all_group.stringMsg))
                console.log(new Date(),'\x1b[36m[langbot_connect_koishi]\x1b[33msend message')
              }else{
                console.log(new Date(),'\x1b[36m[langbot_connect_koishi]\x1b[33mnot send message')
                return 0;
              }
            }
          }else{
            //session.guildId != undefined 群聊消息
            if(session.selfId != session.userId){
              ws.send(JSON.stringify(user.stringMsg))
              console.log(new Date(),'\x1b[36m[langbot_connect_koishi]\x1b[33msend message')
            }else{
              console.log(new Date(),'\x1b[36m[langbot_connect_koishi]\x1b[33mnot send message')
              return 0;
            }
          }
            ws.addEventListener('message',(event) =>{
              Data = JSON.parse(event.data)
              console.log(new Date(),'\x1b[36m[langbot_connect_koishi]\x1b[33mget message\x1b[0m ','\x1b[32mmessage id:\x1b[0m',Data)
              console.log(new Date(),'\x1b[36m[langbot_connect_koishi]\x1b[33mget message\x1b[0m ','\x1b[32mmessage id:\x1b[0m',event.data)
              const seq = JSON.parse(event.data).echo
              const back = {
                'status': 'ok',
                'retcode': 0,
                'data':{
                    'message_id': session.messageId,
                    },
                'message': '',
                'wording': '',
                'echo': seq
              }
              ws.send(JSON.stringify(back))
              console.log(new Date(),'\x1b[36m[langbot_connect_koishi]\x1b[33mback message\x1b[0m ','\x1b[32mmessage id:\x1b[0m',seq)
          })
            wws.send(JSON.stringify(Data))
            console.log(new Date(),'\x1b[36m[langbot_connect_koishi]\x1b[33mback message\x1b[0m ','\x1b[32mmessage id:\x1b[0m',Data)
            return 0;
      })
      })
}

