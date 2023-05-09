# Summarize Any website with Summar.ai

Websites are full of information, but how much of it is useful. I created an app that lets you input the url of a website, to get the summary of its contents. The best part, it uses machine learning to do it.


### Getting Started
ChatGPT developed very rapidly and became a part of our life almost overnight, when I'm learning a complex programming concept or I just don't know simple biology it is the number one resource I access. The world is going in the direction of ai based everything, and I wanted to contribute to that. 

### Prerequisites

To access this tool you can use the webapp, (https://summarai-cloud.herokuapp.com/) or run it locally using

```
node server.js
```

### Installing

Made with love and Node.js make sure that all the prerequired libraries are installed, cors, express, html-to-text. All of which can be installed using npm command.

```
npm install cors
```

## BETA
Currently the model is optimized for summarizing news papers and due to that, there are signifcant gaps in the summary, that will require fixing.
To fix it I will train the model with user based data. I am hoping to implement user feedback within near future so users can rate the summary they recieve which in return will be stored and trained on in addition to all the other datasets.

###V1
Version 1 has been released, the website is now capable of summarizing websites with higher accuracy, as well as, accept user feedback which in return will be used for training of the AI model.

### Results

 The website is capable of creating a basic summary from a given website using its machine learning algorithm. 
|![Target Website](https://github.com/BatuhanAktan/PersonalWebsite/blob/master/images/sourceurl.png?raw=true)|![Result](https://github.com/BatuhanAktan/PersonalWebsite/blob/master/images/resultsummarai.png?raw=true)|
|:---:|:---:|
|Source Website | Resulting Summary |

The Website on its V1 release accepts user feedback, as well as, using a more optimized AI model to summarize.
|![Target Website](https://github.com/BatuhanAktan/PersonalWebsite/blob/master/images/sourceurl.png?raw=true)|![V1 Result](https://github.com/BatuhanAktan/PersonalWebsite/blob/master/images/summaraiv1.png?raw=true)|
|:---:|:---:|
|Source Website | Resulting Summary V1|

### Conclusion

To conclude, summarai V1 release was a success with an average user base of 5 users per night, the project is off to a great start for data collection and analysis. The data is currently being collected in the SQL Database to be used as training material for the model.

## Authors

* **Batuhan Aktan** - [Github](https://github.com/BatuhanAktan)

## License

This project is licensed under the MIT License.

