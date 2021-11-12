<script>
import { ref } from "@vue/reactivity";

// import { onMounted } from "@vue/runtime-core";

export default {
  setup() {
    const boardNum = ref(9);
    const boardWin = ref([0, 0, 0, 0, 0, 0, 0, 0, 0]);
    const Xsrc = require("@/assets/yellow2.png");
    const Osrc = require("@/assets/red2.png");
    const winner = ref(null);
    const player = ref(false);
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

    const playChess = (e) => {
      let num = e.target.dataset.num;
      if (player.value === false && boardWin.value[num] === 0) {
        e.target.innerHTML = `<img src="${Osrc}" />`;
        boardWin.value[num] = 1;
        player.value = !player.value;
      } else if (player.value === true && boardWin.value[num] === 0) {
        e.target.innerHTML = `<img src="${Xsrc}" />`;
        boardWin.value[num] = -1;
        player.value = !player.value;
      }
      count.value++;
      isWin();
    };

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

    const reStart = () => {
      let clear = document.getElementsByClassName("board");
      boardWin.value = [0, 0, 0, 0, 0, 0, 0, 0, 0];
      winner.value = null;
      count.value = 0;
      for (let i = 0; i < clear.length; i++) {
        clear[i].innerHTML = ``;
      }
    };

    return {
      boardNum,
      Xsrc,
      Osrc,
      player,
      playChess,
      winCondition,
      boardWin,
      winner,
      reStart,
      count,
      back,
    };
  },
};
</script>

<template>
  <div class="main">
    <router-link class="backBtn" to="/">{{ back }}</router-link>
    <div class="gameArea">
      <div
        class="board"
        v-for="(item, index) in boardNum"
        :key="item"
        :data-num="index"
        @click="playChess"
      ></div>
    </div>

    <div class="console">
      <div class="playerNow">
        現在換 :
        <img src="@/assets/yellow2.png" alt="" v-if="player" />
        <img src="@/assets/red2.png" alt="" v-else />
        <!-- {{ player === false ? "紅椒" : "黃椒" }} -->
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
                  {{ winner === true ? "紅椒PAY贏了" : "黃椒PAY贏了" }}
                </h5>
                <h5 class="modal-title" id="staticBackdropLabel" v-else>
                  這次平手
                </h5>
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div class="modal-body"></div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-bs-dismiss="modal"
                  @click="reStart"
                >
                  Restart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.main {
  height: 100vh;
  width: 100%;
  background-color: #2c3e50;
  .backBtn {
    position: absolute;
    left: 0px;
    text-decoration: none;
    color: #fff;
    font-size: 22px;
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
  .console {
    position: absolute;
    top: 80%;
    .playerNow {
      font-size: 20px;
      color: #fff;
    }
  }
}
</style>
