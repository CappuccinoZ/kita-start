// 下雪效果
function createSnowflake() {
    const snowflake = document.createElement('div');
    snowflake.classList.add('snowflake');
    snowflake.innerHTML = '❄'; // 雪花的图标可以更改

    const size = Math.random() * 20 + 10; // 雪花大小范围
    let initialX = (Math.random() * 1.618 - 0.618) * window.innerWidth;

    snowflake.style.fontSize = `${size}px`;
    snowflake.style.left = `${initialX}px`;

    document.body.appendChild(snowflake);

    setTimeout(() => {
        snowflake.remove();
    }, 10000); // 与动画时间一致
}

function snowfall() {
    setInterval(createSnowflake, 300); // 控制雪花的生成速度
}

snowfall();