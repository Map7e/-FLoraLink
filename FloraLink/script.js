document.addEventListener("DOMContentLoaded", () => {
  const bgm = document.getElementById("bgm");
  const flipSound = document.getElementById("flip-sound");
  const winSound = document.getElementById("win-sound");
  const winMessage = document.getElementById("win-message");
  const bloomBanner = document.getElementById("full-bloom-banner");
  const replayButton = document.getElementById("replay-button");
  const board = document.getElementById("game-board");

  flipSound.volume = 1.0;
  winSound.volume = 1.0;

  // 尝试自动播放bgm，可能被浏览器阻止
  bgm.play().catch(() => {
    // 用户没操作时无法播放，等用户第一次操作后播放
    const playOnUserInteraction = () => {
      bgm.play();
      window.removeEventListener('click', playOnUserInteraction);
      window.removeEventListener('keydown', playOnUserInteraction);
    };
    window.addEventListener('click', playOnUserInteraction);
    window.addEventListener('keydown', playOnUserInteraction);
  });

  const images = [1,2,3,4,5,6,7,8,1,2,3,4,5,6,7,8];

  let firstCard = null;
  let lockBoard = false;
  let matchedCount = 0;

  function flipCard(card, showFront) {
    card.style.transition = 'transform 0.4s ease';
    card.style.transform = 'rotateY(90deg)';
    setTimeout(() => {
      if (showFront) {
        card.classList.add('flipped');
        card.style.backgroundImage = 'none';
        card.innerHTML = `<img src="images/flower${card.dataset.value}.png" alt="flower" style="width:100%;height:100%;border-radius:8px" />`;
      } else {
        card.classList.remove('flipped');
        card.style.backgroundImage = "url('images/back.png')";
        card.innerHTML = "";
      }
      card.style.transform = 'rotateY(0deg)';
    }, 200);
  }

  function startGame() {
    matchedCount = 0;
    firstCard = null;
    lockBoard = false;
    board.innerHTML = "";
    images.sort(() => Math.random() - 0.5);

    images.forEach((num) => {
      const card = document.createElement("div");
      card.className = "card";
      card.dataset.value = num;
      card.style.backgroundImage = "url('images/back.png')";
      card.innerHTML = "";

      card.style.transformStyle = 'preserve-3d';
      card.style.perspective = '600px';
      card.style.transition = 'transform 0.4s ease';

      card.addEventListener("click", () => {
        if (lockBoard || card.classList.contains("flipped") || card.classList.contains("matched")) return;

        flipSound.currentTime = 0;
        flipSound.play();

        flipCard(card, true);

        if (!firstCard) {
          firstCard = card;
        } else {
          lockBoard = true;
          if (firstCard.dataset.value === card.dataset.value) {
            setTimeout(() => {
              firstCard.classList.add("matched");
              card.classList.add("matched");

              [firstCard, card].forEach(c => {
                c.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                c.style.opacity = '0';
                c.style.transform = 'scale(0.8)';
                c.style.pointerEvents = 'none';
              });

              matchedCount++;
              if (matchedCount === 8) {
                setTimeout(() => {
                  showWin();
                }, 600);
              }

              firstCard = null;
              lockBoard = false;
            }, 400);
          } else {
            setTimeout(() => {
              flipCard(firstCard, false);
              flipCard(card, false);
            }, 800);
            setTimeout(() => {
              firstCard = null;
              lockBoard = false;
            }, 1200);
          }
        }
      });

      board.appendChild(card);
    });
  }

  function showWin() {
    winMessage.style.display = "block";
    bloomBanner.style.display = "flex";
    replayButton.style.display = "block";
    winSound.currentTime = 0;
    winSound.play();
    createWinEffects();
  }

  function createWinEffects() {
    createFlowers();
    createLeaves();
  }
  function createFlowers() {
    for(let i=0; i<40; i++) {
      const img = document.createElement('img');
      img.src = `images/rotate${(i % 8) + 1}.png`;
      img.classList.add('flower-fall');
      img.style.left = Math.random() * window.innerWidth + 'px';
      img.style.top = '-40px';
      img.style.width = '48px';
      img.style.height = '48px';
      img.style.position = 'fixed';
      img.style.zIndex = '9999';
      img.style.pointerEvents = 'none';
      img.style.animation = `fall-flower ${3 + Math.random() * 2}s linear forwards`;
      document.body.appendChild(img);
      img.addEventListener('animationend', () => img.remove());
    }
  }
  function createLeaves() {
    for(let i=0; i<30; i++) {
      const leaf = document.createElement('img');
      leaf.src = 'images/leaf.png';
      leaf.classList.add('leaf-fall');
      leaf.style.left = Math.random() * window.innerWidth + 'px';
      leaf.style.top = '-30px';
      leaf.style.width = '32px';
      leaf.style.height = '32px';
      leaf.style.position = 'fixed';
      leaf.style.zIndex = '9999';
      leaf.style.pointerEvents = 'none';
      leaf.style.animation = `fall-leaf ${3 + Math.random() * 2}s ease-out forwards`;
      document.body.appendChild(leaf);
      leaf.addEventListener('animationend', () => leaf.remove());
    }
  }

  startGame();
});
