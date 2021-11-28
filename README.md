# Main code

## 1. Setup REACT app
Copy `App.js` and `GANapi.js` into `src` folder of REACT project, then open REACT server

## 2. Setup FLASK server
Install flask / flask-cors and requirements for [styleGAN3][styleGAN3]. Then, run
```
python app.py
```

## 3. Test
Type gen(int) at REACT page and press button. The image will show up after some time...

[styleGAN3]: https://github.com/NVlabs/stylegan3