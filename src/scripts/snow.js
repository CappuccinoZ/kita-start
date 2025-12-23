// 获取随机数
const getRandom = (min, max) => min + Math.random() * (max - min)

// 下雪效果
function createSnowflake() {
    const snowflake = document.createElement('div')
    snowflake.classList.add('snowflake')
    snowflake.innerHTML = '❄'

    // 雪花大小与初始位置
    const size = getRandom(10, 24)
    const initialX = getRandom(-0.618 * window.innerHeight, window.innerWidth)

    snowflake.style.fontSize = `${size}px`
    snowflake.style.left = `${initialX}px`

    const snowArea = document.querySelector(".snow-area");
    snowArea.appendChild(snowflake);

    setTimeout(() => {
        snowflake.remove()
    }, 10000) // 与动画时间一致
}

function snowfall() {
    setInterval(createSnowflake, 300) // 控制雪花的生成速度
}

snowfall()