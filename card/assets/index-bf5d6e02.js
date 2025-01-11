document.addEventListener('DOMContentLoaded', () => {
    const card = document.querySelector('.card');
    const cardEffects = card.querySelector('.card__effects');
    const cardImage = card.querySelector('.card__profile__img');
    const debugOutput = document.createElement('div'); // デバッグ出力用要素を作成
    debugOutput.style.position = 'fixed';
    debugOutput.style.bottom = '0';
    debugOutput.style.left = '0';
    debugOutput.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    debugOutput.style.color = 'white';
    debugOutput.style.padding = '10px';
    debugOutput.style.fontSize = '12px';
    debugOutput.style.zIndex = '1000';
    document.body.appendChild(debugOutput);

    if (!card || !cardEffects || !cardImage) {
        return;
    }

    const setCardAspectRatio = () => {
        const imageWidth = cardImage.naturalWidth;
        const imageHeight = cardImage.naturalHeight;
        const aspectRatio = imageWidth / imageHeight;

        const cardHeight = parseFloat(getComputedStyle(card).height);
        card.style.width = `${cardHeight * aspectRatio}px`;
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
        const beta = event.beta;
        const gamma = event.gamma;

        if (beta === null || gamma === null) {
            return;
        }

        const maxTilt = 40;
        const normalizedBeta = Math.max(-maxTilt, Math.min(maxTilt, beta));
        const normalizedGamma = Math.max(-maxTilt, Math.min(maxTilt, gamma));

        const rotateX = normalizedBeta / maxTilt * 10;
        const rotateY = normalizedGamma / maxTilt * 10;

        const cardRect = card.getBoundingClientRect();
        const mappedMouseX = cardRect.width / 2 + (normalizedGamma / maxTilt) * (cardRect.width / 2);
        const mappedMouseY = cardRect.height / 2 - (normalizedBeta / maxTilt) * (cardRect.height / 2);

        updateCardTransform(rotateX, rotateY, mappedMouseX, mappedMouseY, cardRect);

        // デバッグ情報を出力
        debugOutput.innerHTML = `
            <div>Beta: ${beta ? beta.toFixed(2) : 'null'}</div>
            <div>Gamma: ${gamma ? gamma.toFixed(2) : 'null'}</div>
            <div>Normalized Beta: ${normalizedBeta.toFixed(2)}</div>
            <div>Normalized Gamma: ${normalizedGamma.toFixed(2)}</div>
            <div>Rotate X: ${rotateX.toFixed(2)}</div>
            <div>Rotate Y: ${rotateY.toFixed(2)}</div>
            <div>Mapped Mouse X: ${mappedMouseX.toFixed(2)}</div>
            <div>Mapped Mouse Y: ${mappedMouseY.toFixed(2)}</div>
        `;
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

    if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', handleDeviceOrientation);
    }

    if (cardImage.complete) {
        setCardAspectRatio();
    }
});