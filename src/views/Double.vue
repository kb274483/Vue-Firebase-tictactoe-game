<script>
import DataService from "../services/dataService";
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
export default {
  setup() {
    const id = ref(-2);
    const session = ref(0);
    const playerOne = ref("");
    const playerTwo = ref("");
    const boardNum = ref(9);
    const boardWin = ref([0, 0, 0, 0, 0, 0, 0, 0, 0]);
    const Xsrc = require("@/assets/yellow2.png");
    const Osrc = require("@/assets/red2.png");
    const winner = ref(null);
    const NowPlayer = ref(false);
    const count = ref(0);
    const back = ref("<back");
    const winCondition = ref([
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ]);

    // 判斷ID 將使用者輸入的名字放入對應Player
    const typeName = () => {
      let name = document.querySelector(".form-control");
      let maskOff = document.querySelector(".nameContainer");
      let witchSide = id.value % 2;
      witchSide === 0
        ? (playerOne.value = name.value)
        : (playerTwo.value = name.value);
      maskOff.style.display = "none";
      let updateData = {
        pOne: playerOne.value,
        pTwo: playerTwo.value,
      };
      DataService.updateGame(session.value, updateData);
    };

    // 在每次資料庫更新時執行，同步兩邊資料，並渲染圖片上去。
    const runGame = (item) => {
      boardWin.value = item.val()[session.value].boardRecord;
      count.value = item.val()[session.value].count;
      playerOne.value = item.val()[session.value].pOne;
      playerTwo.value = item.val()[session.value].pTwo;
      NowPlayer.value = item.val()[session.value].switch;
      let chess = document.getElementsByClassName("board");
      boardWin.value.forEach((el, idx) => {
        if (el === 1) {
          chess[idx].innerHTML = `<img src="${Osrc}" />`;
        } else if (el === -1) {
          chess[idx].innerHTML = `<img src="${Xsrc}" />`;
        } else if (el === 0) {
          chess[idx].innerHTML = ``;
        }
      });
      isWin();
    };

    // 每一次下棋時先取得是哪個使用者，便將資料同步上去
    const chess = (e) => {
      let switchPlayer = count.value % 2;
      let num = e.target.dataset.num;
      if (switchPlayer === 0 && boardWin.value[num] === 0) {
        boardWin.value[num] = 1;
        count.value++;
        let result = {
          boardRecord: boardWin.value,
          count: count.value,
          switch: switchPlayer === 0 ? true : false,
        };
        DataService.updateGame(session.value, result);
      } else if (switchPlayer === 1 && boardWin.value[num] === 0) {
        boardWin.value[num] = -1;
        count.value++;
        let result = {
          boardRecord: boardWin.value,
          count: count.value,
          switch: switchPlayer === 0 ? true : false,
        };
        DataService.updateGame(session.value, result);
      }
    };
    
    //依據玩家的ID 分配他們的遊戲場次
    const joinGame = () => {
      if (id.value === 0 || id.value === 1) {
        session.value = 0;
      } else if (id.value === 2 || id.value === 3) {
        session.value = 1;
      } else if (id.value === 4 || id.value === 5) {
        session.value = 2;
      } else if (id.value === 6 || id.value === 7) {
        session.value = 3;
      }
    };

    //確認使用者在進入遊戲時是否取得ID
    const confirmPlayer = (item) => {
      if (id.value === -2) {
        const router = useRouter();
        id.value = item.val().findIndex((el) => el.used === false);
        if (id.value === -1) {
          alert("人數已達上限");
          router.push("/");
        } else {
          DataService.updateList(id.value, { used: true });
          DataService.getAllGame().once("value", joinGame);
        }
      }
    };

    // 贏得比賽的判斷
    const isWin = () => {
      winCondition.value.forEach((item) => {
        let score = boardWin.value;
        let isWin = document.querySelector("#win");
        let winDows = document.querySelector("#staticBackdrop");
        let winPic = document.querySelector(".modal-body");
        if (score[item[0]] + score[item[1]] + score[item[2]] === 3) {
          isWin.click(function () {
            winDows.modal();
          });
          winPic.innerHTML = `<img src="${Osrc}" />`;
          winner.value = true;
        } else if (score[item[0]] + score[item[1]] + score[item[2]] === -3) {
          isWin.click(function () {
            winDows.modal();
          });
          winPic.innerHTML = `<img src="${Xsrc}" />`;
          winner.value = false;
        } else if (count.value === 9) {
          isWin.click(function () {
            winDows.modal();
          });
        }
      });
    };

    // 確認下棋方與資料庫該輪到那一方的資訊一樣，才關閉遮罩。
    const playerSwitch = computed(() =>
      id.value % 2 === NowPlayer.value % 2 ? false : true
    );
    // 要再雙方都有玩家時才可以進行遊戲。
    const wait = computed(() =>
      playerOne.value === "" || playerTwo.value === "" ? true : false
    );
    // 建立與資料庫的連線以及監聽網頁即將關閉的事件，隨時取得最新資料。
    onMounted(() => {
      DataService.getAll().on("value", confirmPlayer);
      DataService.getAllGame().on("value", runGame);
      window.addEventListener("beforeunload", (e) => beforeunloadHandler(e));
    });
    // 網頁即將關閉或元件毀滅時進行資料庫資料還原。
    // ----------------------------------------------
    onBeforeUnmount(() => {
      let playerID = id.value % 2;
      if (playerID === 0) {
        playerOne.value = "";
      } else if (playerID === 1) {
        playerTwo.value = "";
      }
      let data = {
        pOne: playerOne.value,
        pTwo: playerTwo.value,
        count: 0,
        switch: false,
        gamesID: session.value,
        boardRecord: [0, 0, 0, 0, 0, 0, 0, 0, 0],
      };
      if (id.value >= 0) {
        DataService.updateList(id.value, { used: false });
      }
      DataService.updateGame(session.value, data);
      window.removeEventListener("beforeunload", (e) =>
        this.beforeunloadHandler(e)
      );
    });
    const beforeunloadHandler = (e) => {
      let playerID = id.value % 2;
      if (playerID === 0) {
        playerOne.value = "";
      } else if (playerID === 1) {
        playerTwo.value = "";
      }
      let data = {
        pOne: playerOne.value,
        pTwo: playerTwo.value,
        count: 0,
        switch: false,
        gamesID: session.value,
        boardRecord: [0, 0, 0, 0, 0, 0, 0, 0, 0],
      };
      if (id.value >= 0) {
        DataService.updateList(id.value, { used: false });
      }
      DataService.updateGame(session.value, data);
      console.log(e);
    };
    // ----------------------------------------------
    return {
      NowPlayer,
      back,
      boardNum,
      Osrc,
      Xsrc,
      winCondition,
      playerOne,
      playerTwo,
      typeName,
      chess,
      playerSwitch,
      winner,
      wait,
    };
  },
};
</script>

<template>
  <div class="mainContainer">
    <router-link class="backBtn" to="/">{{ back }}</router-link>
    <div class="playerName">
      <p>{{ playerOne }}</p>
      VS
      <p>{{ playerTwo }}</p>
    </div>
    <div class="playerNow" v-if="playerSwitch">
      <p>等待對手下棋</p>
    </div>
    <div class="gameArea">
      <div
        class="board"
        v-for="(item, index) in boardNum"
        :key="item"
        :data-num="index"
        @click="chess"
      ></div>
    </div>
    <div class="mask" v-if="wait">
      <div class="spinner-border" role="status"></div>
      <p>配對中</p>
    </div>
    <div class="nameContainer">
      <div class="input-group mb-3">
        <input
          type="text"
          class="form-control"
          placeholder="Type name"
          aria-label="Recipient's username"
          aria-describedby="button-addon2"
        />
        <button
          class="btn btn-outline-secondary"
          type="button"
          id="button-addon2"
          @click="typeName"
        >
          Send
        </button>
      </div>
    </div>
    <div class="end" v-if="true">
      <!-- Button trigger modal -->
      <button
        v-show="false"
        type="button"
        class="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#staticBackdrop"
        id="win"
      ></button>
      <!-- Modal -->
      <div
        class="modal fade"
        id="staticBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabindex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5
                class="modal-title"
                id="staticBackdropLabel"
                v-if="winner !== null"
              >
                {{
                  winner === true
                    ? playerOne + "紅椒PAY贏了"
                    : playerTwo + "黃椒PAY贏了"
                }}
              </h5>
              <h5 class="modal-title" id="staticBackdropLabel" v-else>
                這次平手
              </h5>
              <!-- <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button> -->
            </div>
            <div class="modal-body"></div>
            <div class="modal-footer">
              <router-link to="/">
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Reconnection
                </button>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.mainContainer {
  height: 100vh;
  width: 100%;
  background-color: #2c3e50;
  display: flex;
  justify-content: center;
  .backBtn {
    position: absolute;
    left: 0px;
    text-decoration: none;
    color: #fff;
    font-size: 22px;
  }
  .playerName {
    position: absolute;
    top: 100px;
    color: #fff;
    font-size: 22px;
    display: flex;
    justify-content: center;
    text-align: center;
    p {
      margin: 0 20px;
    }
  }
  .playerNow {
    position: absolute;
    top: 50px;
    color: rgba(1, 46, 54, 0.849);
    font-size: 22px;
    font-weight: bold;
    display: flex;
    justify-content: center;
    text-align: center;
    z-index: 50;
    height: 92vh;
    width: 100%;
    background-color: #aaaaaae5;
  }
  .gameArea {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 600px;
    height: 600px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 33% 34% 33%;
    grid-template-rows: 33% 34% 33%;
    .board {
      border: 2px solid #fff;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    @media (max-width: 450px) {
      width: 100%;
      height: 50%;
    }
  }
  .nameContainer {
    height: 100vh;
    width: 100%;
    background-color: #363636ea;
    position: absolute;
    z-index: 200;
    display: flex;
    align-items: center;
    justify-content: center;
    .input-group {
      width: 70%;
      button {
        background-color: rgb(127, 228, 231);
      }
    }
  }
  .mask {
    height: 95vh;
    width: 100%;
    background-color: #c2c2c29a;
    position: absolute;
    top: 50px;
    z-index: 100;
    .spinner-border,
    p {
      position: relative;
      font-size: 25px;
      color: #fff;
      top: 40%;
    }
  }
}
</style>
