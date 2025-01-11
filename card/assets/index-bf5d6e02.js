document.addEventListener('DOMContentLoaded', () => {
    const card = document.querySelector('.card');
    const cardEffects = card.querySelector('.card__effects');
    const cardImage = card.querySelector('.card__profile__img');

    if (!card || !cardEffects || !cardImage) {
        return;
    }

    const setCardAspectRatio = () => {
        const imageWidth = cardImage.naturalWidth;
        const imageHeight = cardImage.naturalHeight;
        const aspectRatio = imageWidth / imageHeight;

        // カードの高さを固定値とし、幅をアスペクト比に基づいて計算
        const cardHeight = parseFloat(getComputedStyle(card).height);
        card.style.width = `${cardHeight * aspectRatio}px`;

        // または、カードの幅を固定値とし、高さをアスペクト比に基づいて計算
        // const cardWidth = parseFloat(getComputedStyle(card).width);
        // card.style.height = `${cardWidth / aspectRatio}px`;
    };

    cardImage.onload = setCardAspectRatio;

    const handleMouseMove = (event) => {
        const cardRect = card.getBoundingClientRect();
        const mouseX = event.clientX - cardRect.left;
        const mouseY = event.clientY - cardRect.top;
        const centerX = cardRect.width / 2;
        const centerY = cardRect.height / 2;
        const tiltX = -(mouseY - centerY) / centerY;
        const tiltY = (mouseX - centerX) / centerX;
        const rotateX = tiltX * 10;
        const rotateY = tiltY * 10;

        updateCardTransform(rotateX, rotateY, mouseX, mouseY, cardRect);
    };

    const handleDeviceOrientation = (event) => {
        const beta = event.beta; // Front to back tilt (X-axis)
        const gamma = event.gamma; // Left to right tilt (Y-axis)

        if (beta === null || gamma === null) {
            return;
        }

        const maxTilt = 15; // 最大傾斜角度を調整
        const normalizedBeta = Math.max(-maxTilt, Math.min(maxTilt, beta));
        const normalizedGamma = Math.max(-maxTilt, Math.min(maxTilt, gamma));

        const rotateX = normalizedBeta / maxTilt * 10; // マウスのtiltXに合わせて調整
        const rotateY = normalizedGamma / maxTilt * 10; // マウスのtiltYに合わせて調整

        // デバイスの傾きをマウスの位置に変換するための仮の計算
        const cardRect = card.getBoundingClientRect();
        const mappedMouseX = cardRect.width / 2 + (normalizedGamma / maxTilt) * (cardRect.width / 2);
        const mappedMouseY = cardRect.height / 2 - (normalizedBeta / maxTilt) * (cardRect.height / 2);

        updateCardTransform(rotateX, rotateY, mappedMouseX, mappedMouseY, cardRect);
    };

    const updateCardTransform = (rotateX, rotateY, mouseX, mouseY, cardRect) => {
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
        cardEffects.style.setProperty('--pointer-x', `${mouseX / cardRect.width * 100}%`);
        cardEffects.style.setProperty('--pointer-y', `${mouseY / cardRect.height * 100}%`);
        cardEffects.style.setProperty('--opacity', '1');
    };

    const handleMouseLeave = () => {
        resetCardTransform();
    };

    const resetCardTransform = () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        cardEffects.style.setProperty('--opacity', '0');
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    // デバイスオリエンテーションイベントリスナーを追加
    if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', handleDeviceOrientation);
    }

    // 初期ロード時にもアスペクト比を設定 (キャッシュされた画像用)
    if (cardImage.complete) {
        setCardAspectRatio();
    }
});