<template>
    <v-app>
        <v-container fluid fill-height>
            <v-layout flex align-center justify-center>
                <v-flex xs12 sm4 elevation-6>
                    <v-toolbar class="teal">
                        <v-toolbar-title class="white--text">
                            <font size="5">
                                <v-icon dark large>mdi-account-box</v-icon>
                                Profile
                            </font>
                        </v-toolbar-title>
                    </v-toolbar>
                    <v-card>
                        <v-card-text pt-4>
                            <v-layout>
                                <v-flex>
                                    <v-text-field label="ชื่อผู้ใช้งาน:" ref="username" v-model="username" :rules="usernameRules" required
                                    @keypress.enter="login" color="teal"></v-text-field>
                                </v-flex>
                            </v-layout>
                            <v-layout>
                                <v-flex>
                                    <v-text-field label="รหัสผ่าน:" v-model="password" :type="hidePass ? 'password' : 'text'" 
                                    :rules="passwordRules" required @keypress.enter="login" ref="password" color="teal"
                                    :append-icon="hidePass ? 'mdi-eye' : 'mdi-eye-off'" @click:append="hidePass = !hidePass">
                                    </v-text-field>
                                </v-flex>
                            </v-layout><br>
                            <v-layout>
                                <v-flex text-center>
                                    <v-btn @click="login" color="teal" dark>เข้าสู่ระบบ</v-btn>
                                </v-flex>
                            </v-layout>
                        </v-card-text>
                    </v-card>
                </v-flex>
            </v-layout>

            <template>

                <v-dialog v-model="showProgress" max-width="80" persistent>
                    <div class="text-center">
                        <v-card>
                            <v-card-text>
                                <v-progress-circular :size="30" color="teal" indeterminate></v-progress-circular>
                            </v-card-text>
                        </v-card>
                    </div>
                </v-dialog>

                <v-dialog v-model="showError" width="unset">
                    <div class="text-center">
                        <v-card>
                            <v-card-text>
                                <v-layout>
                                    <v-flex>
                                        <v-icon color="red" :size="45">mdi-close-circle-outline</v-icon>
                                    </v-flex>
                                </v-layout>
                                <v-layout>
                                    <v-flex>
                                        {{msgError}}
                                    </v-flex>
                                </v-layout>
                            </v-card-text>
                        </v-card>
                    </div>
                </v-dialog>

            </template>
        </v-container>
    </v-app>
</template>
<script>
import {db} from '@/firebase'
export default {
    data(){
        return{
            hidePass: true,
            passwordRules: [
                v=>!!v || 'กรุณากรอกรหัสผ่าน'
            ],
            password: '',
            usernameRules: [
                v=>!!v || 'กรุณากรอกชื่อผู้ใช้งาน',
            ],
            username: '',
            msgError: '',
            showError: false,
            showProgress: false,
        }
    },
    methods:{
        login(){
            if(!this.$refs.username.validate() || !this.$refs.password.validate()){
                if(!this.$refs.username.validate()){
                    this.$refs.username.focus()
                }
                else{
                    this.$refs.password.focus()
                }
            }
            else{
                this.showProgress = true
                db.collection("user").where("username", "==", this.username).get()
                .then(query=>{
                    if(query.docs.length == 0){
                        this.showProgress = false
                        this.msgError = "ชื่อผู้ใช้งานไม่ถูกต้อง โปรดลองใหม่อีกครั้ง"
                        this.showError = true
                        setTimeout(()=>{
                            this.showError = false
                            this.$nextTick(()=>this.$refs.username.focus())
                        },2000)
                    }
                    else{
                        let chkPass = ""
                        let role = ""
                        let name = ""
                        query.forEach(doc=>{
                            name = doc.data().name + (doc.data().lastName ? " " + doc.data().lastName : "")
                            chkPass = doc.data().password
                            role = doc.data().role
                        })
                        if(chkPass != this.password){
                            this.showProgress = false
                            this.msgError = "รหัสผ่านไม่ถูกต้อง โปรดลองใหม่อีกครั้ง"
                            this.showError = true
                            setTimeout(()=>{
                                this.showError = false
                                this.$nextTick(()=>this.$refs.password.focus())
                            },2000)
                        }
                        else{
                            this.showProgress = false
                            localStorage.setItem('setupTime', new Date().getTime())
                            localStorage.setItem('status', role)
                            localStorage.setItem('user', name)
                            localStorage.setItem('username', this.username)
                            this.$router.currentRoute.name !== 'index' && this.$router.push({ name: 'index' })
                        }
                    }
                })
            }
        }
    },
    mounted(){
        let setupTime = localStorage.getItem('setupTime')
        if(setupTime != null){
            this.$router.currentRoute.name !== 'index' && this.$router.push({ name: 'index' })
        }
        else{
            this.$nextTick(()=>this.$refs.username.focus())
        }
    }
}
</script>