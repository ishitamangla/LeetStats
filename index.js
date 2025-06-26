document.addEventListener("DOMContentLoaded",function(){

    const searchButton = document.getElementById("search-btn");
    const userNameInput = document.getElementById("user-input");
    const statsContainer = document.querySelectorAll(".stats-container");
    const easyProgressCircle = document.querySelector('.easy-progress');
    const mediumProgressCircle = document.querySelector('.medium-progress');
    const hardProgressCircle = document.querySelector('.hard-progress');
    const easyLabel = document.querySelector('#easy-label');
    const mediumLabel = document.querySelector('#medium-label');
    const hardLabel = document.querySelector('#hard-label');
    const cardStatsContainer = document.querySelector(".stat-cards");

    //return true or false based on whether username is valid or not
    function validateUsername(username){
        //trim: used to remove whitespace from both ends of a string
        if(username.trim() === ""){
            alert("Username should not be empty");
            return false;
        }
        //regex: used to tell a format of input
        const regex = /^[a-zA-Z_][a-zA-Z0-9_-]{2,15}$/;
        const isMatching = regex.test(username);
        if(!isMatching){
            alert("Invalid Username");
        }
        return isMatching;
    }


    async function fetchUserDetails(username){
        const url = `https://leetcode-stats-api.herokuapp.com/${username}`
        try{
            searchButton.textContent = "searching....";
            searchButton.disabled = true;

            const response = await fetch(url);
            if(!response.ok){
                throw new Error("unable to fetch the user details");
            }
            
            const parsedData = await response.json();
                if(parsedData.status = 'error'){
                    statsContainer.style.display = "none";
                }
            displayUserData(parsedData);
            console.log("Logging data : ",parsedData);


        }
        catch(error){
            statsContainer.innerHTML = `<p>${error.message}</p>`
        }
        finally{
            searchButton.textContent = "Search";
            searchButton.disabled = false;
        }
    }


    function displayUserData(parsedData){
        const totalQues = parsedData.totalQuestions;
        const totalHardQues = parsedData.totalHard;
        const totalMediumQues = parsedData.totalMedium;
        const totalEasyQues = parsedData.totalEasy;
        const solvedTotal = parsedData.totalSolved;
        const solvedHardQues = parsedData.hardSolved;
        const solvedMediumQues = parsedData.mediumSolved;
        const solvedEasyQues = parsedData.easySolved;
        updateProgress(solvedEasyQues,totalEasyQues,easyLabel,easyProgressCircle);
        updateProgress(solvedMediumQues,totalMediumQues,mediumLabel,mediumProgressCircle);
        updateProgress(solvedHardQues,totalHardQues,hardLabel,hardProgressCircle);


        const cardData = [
            {label:"Acceptance Rate",value:parsedData.acceptanceRate},
            {label:"Ranking",value:parsedData.ranking},
            {label:"Reputations",value:parsedData.reputation}
        ];

        cardStatsContainer.innerHTML = cardData.map(
            data=>{
                return `<div class = "card">
                <h4>${data.label}</h4>
                <p>${data.value}</p>
                </div>`
            }
        ).join('');
    }

    function updateProgress(solved,total,label,circle){
        const progressDegree = (solved/total)*100;
        circle.style.setProperty('--progress-degree',`${progressDegree}%`);
        label.textContent =`${solved}/${total}`;
    }

    searchButton.addEventListener('click',function(){
        const username = userNameInput.value;
        console.log("loggin username: ",username);
        if(validateUsername(username)){
            fetchUserDetails(username);
        }
    })


    






})