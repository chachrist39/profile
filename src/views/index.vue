<template>
    <v-app>
        <mainMenu></mainMenu>
        <v-container>
            <v-layout justify-center>
                <v-flex lg4 md6 sm8 xs12>
                    <v-card tile>
                        <v-card-text class="cyan">
                            <v-layout>
                                <v-flex text-center>
                                    <font size="3" color="white">ข้อมูลส่วนตัว</font>
                                </v-flex>
                            </v-layout>
                        </v-card-text>
                        <v-card-text>
                            <v-layout>
                                <v-flex pr-2>
                                    <v-text-field label="ชื่อผู้ใช้งาน:" ref="username" v-model="username" 
                                    :rules="usernameRules" required color="cyan" :readonly="chkEdit == true"></v-text-field>
                                </v-flex>
                                <v-flex>
                                    <v-text-field label="รหัสผ่าน:" v-model="password" :type="hidePass ? 'password' : 'text'" 
                                    :rules="passwordRules" required @keypress.enter="login" ref="password" color="teal"
                                    :append-icon="hidePass ? 'mdi-eye' : 'mdi-eye-off'" @click:append="hidePass = !hidePass">
                                    </v-text-field>
                                </v-flex>
                            </v-layout>
                            <v-layout>
                                <v-flex pr-2>
                                    <v-text-field label="ชื่อ:" v-model="name" ref="name" color="cyan" :rules="nameRules" required></v-text-field>
                                </v-flex>
                                <v-flex>
                                    <v-text-field label="นามสกุล:" v-model="lastName" ref="lastName" color="cyan" :rules="lastNameRules" required></v-text-field>
                                </v-flex>
                            </v-layout>
                            <v-layout>
                                <v-flex pr-2>
                                    <v-text-field label="เบอร์โทรศัพท์:" v-model="tel" ref="tel" color="cyan" :rules="telRules" required></v-text-field>
                                </v-flex>
                                <v-flex>
                                    <v-text-field label="อายุ:" v-model="age" ref="age" color="cyan" :rules="ageRules" required></v-text-field>
                                </v-flex>
                            </v-layout>
                            <v-layout>
                                <v-flex>
                                    <v-textarea outlined label="ที่อยู่:" v-model="address" ref="address" color="cyan" rows="3" :rules="addressRules" required></v-textarea>
                                </v-flex>
                            </v-layout>
                            <v-divider></v-divider><br>
                            <v-layout>
                                <v-flex pr-2 text-right>
                                    <v-btn v-if="chkEdit == false" @click="saveProfile" color="green" dark>บันทึก</v-btn>
                                    <v-btn v-else @click="confiEditProfile" color="orange" dark>บันทึก</v-btn>
                                </v-flex>
                                <v-flex text-left>
                                    <v-btn @click="cancelProfile" color="red" dark>ยกเลิก</v-btn>
                                </v-flex>
                            </v-layout>
                        </v-card-text>
                    </v-card>
                </v-flex>
            </v-layout><br>

            <v-divider></v-divider><br>
            <v-layout>
                <v-flex>
                    <v-data-table :headers="headProFile" :items="profileInfo" class="elevation-3" dense mobile-breakpoint>
                        <template v-slot:no-data>
                            <v-progress-linear v-if="progressData"  height="10px" 
                            v-slot:progress color="teal" indeterminate></v-progress-linear>
                            <v-flex v-if="noData">
                                <strong><font color="red">ไม่พบข้อมูล</font></strong>
                            </v-flex>
                        </template>
                        <template v-slot:item.btn="{ item }">
                            <v-tooltip right>
                                <template v-slot:activator="{ on }">
                                    <v-icon color="teal" @click="editProfile(item)" 
                                    v-on="on">mdi-account-edit</v-icon>
                                </template>
                                <span>แก้ไขข้อมูลผู้ใช้งาน</span>
                            </v-tooltip>
                        </template>
                    </v-data-table>
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

                <v-dialog v-model="showSuccess"  width="unset" persistent>
                    <div class="text-center">
                        <v-card>
                            <v-card-text>
                                <v-layout>
                                    <v-flex>
                                        <v-icon color="green" :size="45">mdi-check-circle-outline</v-icon>
                                    </v-flex>
                                </v-layout>
                                <v-layout>
                                    <v-flex>
                                        บันทึกสำเร็จ!
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
import mainMenu from '@/components/menu'
import {db} from '@/firebase'
export default {
    components:{
        mainMenu
    },
    data(){
        return{
            keyDoc: '',
            chkEdit: false,
            headProFile: [
                { text: 'ชื่อผู้ใช้งาน', align: 'left', value: 'username' },
                { text: 'ชื่อ', align: 'left', value: 'name' },
                { text: 'นามสกุล', align: 'left', value: 'lastName' },
                { text: 'เบอร์โทรศัพท์', align: 'left', value: 'tel' },
                { text: 'อายุ', align: 'left', value: 'age' },
                { text: 'ที่อยู่', align: 'left', value: 'address' },
                { text: '', sortable: false, align: 'left', value: 'btn' },
            ],
            profileInfo: [],
            address: '',
            addressRules:[
                v=>!!v || 'กรุณากรอกที่อยู่'
            ],
            age: '',
            ageRules: [
                v=>!!v || 'กรุณากรอกอายุ'
            ],
            tel: '',
            telRules: [
                v=>!!v || 'กรุณากรอกเบอร์โทรศัพท์'
            ],
            lastName: '',
            lastNameRules: [
                v=>!!v || 'กรุณากรอกนามสกุล'
            ],
            name: '',
            nameRules: [
                v=>!!v || 'กรุณากรอกชื่อ'
            ],
            hidePass: true,
            passwordRules: [
                v=>!!v || 'กรุณากรอกรหัสผ่าน'
            ],
            password: '',
            usernameRules: [
                v=>!!v || 'กรุณากรอกชื่อผู้ใช้งาน',
            ],
            username: '',
            showSuccess: false,
            msgError: '',
            showError: false,
            showProgress: false,
            progressData: false,
            noData: true
        }
    },
    methods:{
        confiEditProfile(){
            if(!this.$refs.username.validate() || !this.$refs.password.validate() || !this.$refs.name.validate() || 
            !this.$refs.lastName.validate() || !this.$refs.tel.validate() || !this.$refs.age.validate() || !this.$refs.address.validate()){
                if(!this.$refs.username.validate()){
                    this.$refs.username.focus()
                }
                else if(!this.$refs.password.validate()){
                    this.$refs.password.focus()
                }
                else if(!this.$refs.name.validate()){
                    this.$refs.name.focus()
                }
                else if(!this.$refs.lastName.validate()){
                    this.$refs.lastName.focus()
                }
                else if(!this.$refs.tel.validate()){
                    this.$refs.tel.focus()
                }
                else if(!this.$refs.age.validate()){
                    this.$refs.age.focus()
                }
                else{
                    this.$refs.address.focus()
                }
            }
            else{
                this.showProgress = true
                db.collection("user").doc(this.keyDoc).update({
                    password: this.password,
                    name: this.name,
                    lastName: this.lastName,
                    tel: this.tel,
                    age: this.age,
                    address: this.address
                })
                .then(()=>{
                    this.showProgress = false
                    this.showSuccess = true
                    setTimeout(()=>{
                        this.showSuccess = false
                        this.cancelProfile()
                    },1500)
                })
            }
        },
        editProfile(item){
            this.keyDoc = item.id
            this.address = item.address
            this.age = item.age
            this.tel = item.tel
            this.lastName = item.lastName
            this.name = item.name
            this.password = item.password
            this.username = item.username
            this.chkEdit = true
        },
        getProfile(){
            this.profileInfo = []
            this.noData = false
            this.progressData = true
            db.collection("user").onSnapshot(query=>{
                this.profileInfo = []
                if(query.docs.length == 0){
                    this.progressData = false
                    this.noData = true
                }
                else{
                    let i = 0
                    query.forEach(doc=>{
                        this.profileInfo.push({ id: query.docs[i].id, ...doc.data() })
                        i++
                    })
                    this.progressData = false
                    this.noData = false
                }
            })
        },
        saveProfile(){
            if(!this.$refs.username.validate() || !this.$refs.password.validate() || !this.$refs.name.validate() || 
            !this.$refs.lastName.validate() || !this.$refs.tel.validate() || !this.$refs.age.validate() || !this.$refs.address.validate()){
                if(!this.$refs.username.validate()){
                    this.$refs.username.focus()
                }
                else if(!this.$refs.password.validate()){
                    this.$refs.password.focus()
                }
                else if(!this.$refs.name.validate()){
                    this.$refs.name.focus()
                }
                else if(!this.$refs.lastName.validate()){
                    this.$refs.lastName.focus()
                }
                else if(!this.$refs.tel.validate()){
                    this.$refs.tel.focus()
                }
                else if(!this.$refs.age.validate()){
                    this.$refs.age.focus()
                }
                else{
                    this.$refs.address.focus()
                }
            }
            else{
                this.showProgress = true
                db.collection("user").where("username", "==", this.username).get()
                .then(query=>{
                    if(query.docs.length > 0){
                        this.showProgress = false
                        this.msgError = "ชื่อผู้ใช้งานนี้มีอยู่ในระบบแล้ว กรุณาลองใหม่อีกครั้ง"
                        this.showError = true
                        setTimeout(()=>{
                            this.showError = false
                        },2000)
                    }
                    else{
                        db.collection("user").add({
                            username: this.username,
                            password: this.password,
                            name: this.name,
                            lastName: this.lastName,
                            tel: this.tel,
                            age: this.age,
                            address: this.address
                        })
                        .then(()=>{
                            this.showProgress = false
                            this.showSuccess = true
                            setTimeout(()=>{
                                this.showSuccess = false
                                this.cancelProfile()
                            },1500)
                        })
                    }
                })
            }
        },
        cancelProfile(){
            this.keyDoc = ""
            this.address = ""
            this.age = ""
            this.tel = ""
            this.lastName = ""
            this.name = ""
            this.password = ""
            this.username = ""
            this.chkEdit = false
        }
    },
    mounted(){
        if(localStorage.username){
            this.getProfile()
            this.$refs.username.focus()
        }
    }
}
</script>