# App to run inference on server

import io
from io import BytesIO
import json

from torchvision import models
import torchvision.transforms as transforms
from PIL import Image
import base64
from base64 import b64encode

from flask import Flask, jsonify, request
from flask_cors import CORS

import os
import re
from typing import List, Optional, Tuple, Union

import click
import dnnlib
import numpy as np
import PIL.Image
import torch

import legacy


app = Flask(__name__)
CORS(app)
# imagenet_class_index = json.load(open('imagenet_class_index.json'))
# model = models.densenet121(pretrained=True)
# model.eval()

network_pkl = "https://api.ngc.nvidia.com/v2/models/nvidia/research/stylegan3/versions/1/files/stylegan3-r-afhqv2-512x512.pkl"
device = torch.device('cpu')
with dnnlib.util.open_url(network_pkl) as f:
    G = legacy.load_network_pkl(f)['G_ema'].to(device) # type: ignore


def transform_image(image_bytes):
    my_transforms = transforms.Compose([transforms.Resize(255),
                                        transforms.CenterCrop(224),
                                        transforms.ToTensor(),
                                        transforms.Normalize(
                                            [0.485, 0.456, 0.406],
                                            [0.229, 0.224, 0.225])])
    image = Image.open(io.BytesIO(image_bytes))
    return my_transforms(image).unsqueeze(0)


def get_prediction(image_bytes):
    tensor = transform_image(image_bytes=image_bytes)
    outputs = model.forward(tensor)
    _, y_hat = outputs.max(1)
    predicted_idx = str(y_hat.item())
    return imagenet_class_index[predicted_idx]


def make_transform(translate, angle):
    m = np.eye(3)
    s = np.sin(angle/360.0*np.pi*2)
    c = np.cos(angle/360.0*np.pi*2)
    m[0][0] = c
    m[0][1] = s
    m[0][2] = translate[0]
    m[1][0] = -s
    m[1][1] = c
    m[1][2] = translate[1]
    return m


def get_image_from_gene(gene):
    # Labels.
    label = torch.zeros([1, G.c_dim], device=device)
    """
    if G.c_dim != 0:
        if class_idx is None:
            raise ValueError("Don't do this!")
        label[:, class_idx] = 1
    else:
        if class_idx is not None:
            print ('warn: --class=lbl ignored when running on an unconditional network')
    
    # Generate images.
    for seed_idx, seed in enumerate(seeds):
        print('Generating image for seed %d (%d/%d) ...' % (seed, seed_idx, len(seeds)))
        z = torch.from_numpy(np.random.RandomState(seed).randn(1, G.z_dim)).to(device)

        # Construct an inverse rotation/translation matrix and pass to the generator.  The
        # generator expects this matrix as an inverse to avoid potentially failing numerical
        # operations in the network.
        if hasattr(G.synthesis, 'input'):
            m = make_transform(translate, rotate)
            m = np.linalg.inv(m)
            G.synthesis.input.transform.copy_(torch.from_numpy(m))

        img = G(z, label, truncation_psi=truncation_psi, noise_mode=noise_mode)
        img = (img.permute(0, 2, 3, 1) * 127.5 + 128).clamp(0, 255).to(torch.uint8)
        PIL.Image.fromarray(img[0].cpu().numpy(), 'RGB').save(f'{outdir}/seed{seed:04d}.png')
    """
    # Let's assume gene to be integer,
    gene = int(gene) # eType conversion. Fragile?
    z = torch.from_numpy(np.random.RandomState(gene).randn(1, G.z_dim)).to(device)
    translate = [0,0]
    rotate = 0
    truncation_psi = 1
    noise_mode = 'const'

    if hasattr(G.synthesis, 'input'):
        m = make_transform(translate, rotate)
        m = np.linalg.inv(m)
        G.synthesis.input.transform.copy_(torch.from_numpy(m))

    img = G(z, label, truncation_psi=truncation_psi, noise_mode=noise_mode)
    img = (img.permute(0, 2, 3, 1) * 127.5 + 128).clamp(0, 255).to(torch.uint8)
    return img[0].cpu().numpy()

"""
@app.route('/predict', methods=['POST'])
def predict():
    if request.method == 'POST':
        file = request.files['file']
        img_bytes = file.read()
        class_id, class_name = get_prediction(image_bytes=img_bytes)
        return jsonify({'class_id': class_id, 'class_name': class_name})
"""

@app.route('/')
def hello():
    return 'Gene-to-Image API running on local'

@app.route('/gene', methods=['POST'])
def gene():
    if request.method == 'POST':
        gene = request.get_json()
        gene = gene['gene']
        print(" * Gene received : ", gene)

        # Generate image by running styleGAN
        img = get_image_from_gene(gene)
        img = PIL.Image.fromarray(img, 'RGB')

        # Convert image into base64 string
        # https://stackoverflow.com/questions/31826335/how-to-convert-pil-image-image-object-to-base64-string
        buffered = BytesIO()
        img.save(buffered, format="png")
        img_str = base64.b64encode(buffered.getvalue())

        # Decode bytes into utf-8 string to send as json format
        # https://stackoverflow.com/questions/37225035/serialize-in-json-a-base64-encoded-data
        img_base64 = img_str.decode('utf-8')
        print(" * Image data geneated successfully!")

        return json.dumps({"result" : img_base64})


if __name__ == '__main__':
    app.run(port=3000)
