<p align="center">
<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&height=200&section=header&text=PrayrHalaqaBot&fontSize=80&fontAlignY=35&animation=twinkling&fontColor=gradient"/> </a> 
</p>
Introducing the Prayr Halaqa Discord Bot! This versatile bot allows you to effortlessly register users, log and view previous halaqa sessions, as well as conveniently edit or delete any session. Enhance your Quran study groups with ease and efficiency using this essential tool.

## 📑 Feature
- [x] Register Reciter
- [ ] Log Session
- [ ] View Previous Sessions
- [ ] Edit Sessions
- [ ] Delete Sessions


## 📎 Requirements

1. Node.js v18+ **[Download](https://nodejs.org/en/downl18d/)**
2. MongoDB **[Download](https://www.mongodb.com/try/download/community)** (Download & install = Finish!)
3. Discord Bot Token **[Guide](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot)**

## 📚 Installation

```
git clone https://github.com/luqmanrumaiz/Halaqa-Discord-Bot
cd Halaqa-Discord-Bot
npm install
```

After installation finishes you can use `node .` to start the bot

## 📄 Configuration

Create an .env file like below 

```.env
DISCORD_TOKEN=REPLACE_HERE
CLIENT_ID=REPLACE_HERE
GUILD_ID=REPLACE_HERE
CONNECTION_STRING=mongodb://127.0.0.1:27017/quran_halaqa_db
```

## 🔩 Features & Commands

> Note: The default prefix is '/' (SlashCommands)

> Your can settings all in Folder `Settings`

> Optional: [] | Required: ()

💫 **Commands!** 
- `/register (name) (gender)` - Register Reciter

***⚠️ TODO***

## 📝 Credits
Developed by [Abdul Basith](https://github.com/abdulbasithh) and [Luqman Rumaiz](https://github.com/luqmanrumaiz)
