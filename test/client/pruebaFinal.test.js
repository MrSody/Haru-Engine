/**
 * @jest-environment jsdom
 */

const { createCanvas, loadImage } = require('canvas')
const canvas = createCanvas(200, 200)
const ctx = canvas.getContext('2d')

test("prueba", async () => {
    // Write "Awesome!"
    ctx.font = '30px Impact'
    ctx.rotate(0.1)
    ctx.fillText('Awesome!', 50, 100)

    // Draw line under text
    let text = ctx.measureText('Awesome!')
    ctx.strokeStyle = 'rgba(0,0,0,0.5)'
    ctx.beginPath()
    ctx.lineTo(50, 102)
    ctx.lineTo(50 + text.width, 102)
    ctx.stroke()

    const image = await loadImage('https://placekitten.com/400/300');
    ctx.drawImage(image, 50, 0, 70, 70);

    const dataURL = canvas.toDataURL();
    expect(dataURL).toMatchSnapshot();
  });