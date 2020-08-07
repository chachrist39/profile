<template>
    <div>
        <v-app-bar class="teal">
            <v-app-bar-nav-icon @click.native.stop="sideNav = !sideNav" class="hidden-md-and-up" dark></v-app-bar-nav-icon>
            <v-toolbar-title><font color="white">PROFILE</font></v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items class="hidden-xs-only hidden-sm-only">
                <v-menu open-on-hover offset-y bottom v-for="item in menuItem" :key="item.title">
                    <template v-slot:activator="{ on }">
                        <v-btn text v-on="on" dark router :to="item.link">
                            <v-icon>{{item.icon}}</v-icon>
                            {{item.title}}
                        </v-btn>
                    </template>
                    <v-list v-if="item.items">
                        <template v-for="subItem in item.items">
                            <v-list-item v-if="subItem.title == 'ออกจากระบบ'" :to="subItem.link" :key="subItem.title" 
                            color="teal" @click="logout">
                                <v-list-item-title>{{subItem.title}}</v-list-item-title>
                            </v-list-item>
                            <v-list-item color="teal" v-else :key="subItem.title" :to="subItem.link">
                                <v-list-item-title>{{subItem.title}}</v-list-item-title>
                            </v-list-item>
                        </template>
                    </v-list>
                </v-menu>
            </v-toolbar-items>
        </v-app-bar>

        <v-navigation-drawer temporary v-model="sideNav" absolute color="teal" style="position:fixed; top:0; left:0;">
            <v-list-item>
                <v-list-item-icon>
                    <v-icon color="white">mdi-account-circle</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                    <v-list-item-title><font color="white">{{user}}</font></v-list-item-title>
                </v-list-item-content>
            </v-list-item>

            <v-divider></v-divider>

            <v-list dense nav v-for="item in navItem" :key="item.title">
                <v-list-item v-if="!item.subMenu" :to="item.link">
                    <v-list-item-icon>
                        <v-icon color="white">{{item.icon}}</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title><font color="white">{{ item.title }}</font></v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-group v-else no-action color="white">
                    <template v-slot:activator>
                        <v-list-item-icon>
                            <v-icon>{{item.icon}}</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>
                                    <v-layout>
                                        <v-flex>
                                            {{item.title}}
                                        </v-flex>
                                    </v-layout>
                            </v-list-item-title>
                        </v-list-item-content>
                    </template>
                    <v-list-item v-for="item in item.subMenu" :key="item.title" :to="item.link" dark>
                        <v-list-item-title>
                            {{item.title}}
                        </v-list-item-title>
                    </v-list-item>
                </v-list-group>
            </v-list>

            <v-divider></v-divider>

            <v-list dense nav>
                <v-list-item dark @click="logout">
                    <v-list-item-icon>
                        <v-icon>mdi-logout</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title>ออกจากระบบ</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>
    </div>
</template>
<script>
export default {
    data(){
        return{
            sideNav: false,
        }
    },
    methods:{
        logout(){
            localStorage.clear()
            this.$router.push("/")
        }
    },
    computed:{

        menuItem(){
            let menuItem = []
            menuItem = [
                { title: 'หน้าแรก', icon: 'mdi-home', link: '/index' },
                { title: this.user, icon: 'mdi-account-circle', 
                    items:[
                        { title: 'ออกจากระบบ' },
                    ]
                }
            ]
            return menuItem
        },

        navItem(){
            let navItem = []
            navItem = [
                { title: 'หน้าแรก', icon: 'mdi-home', link: '/index' }
            ]
            return navItem
        },

        user(){
            return localStorage.getItem('user')
        },
    },
    mounted(){
        let hours = 1 // รีเซ็ทเมื่อเข้าระบบนานกว่า 1 ชั่วโมง
        let now = new Date().getTime()
        let setupTime = localStorage.getItem('setupTime')
        if(setupTime == null){
            this.$router.currentRoute.name !== 'index' && this.$router.push({ name: 'index' })
        }
        if(now - setupTime > hours*60*60*1000){
            localStorage.clear()
            this.$router.push('/')
        }
    }
}
</script>