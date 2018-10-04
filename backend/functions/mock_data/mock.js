var faker = require("Faker");
var alphanumberic = (nLen, strLen) => faker.Helpers.shuffle(
	[...Array(nLen).keys()].map(()=>faker.random.number(9))
		.concat([...Array(strLen).keys()].map(()=>String.fromCharCode(65+faker.random.number(26))
		))
).join("");
var randomizedData = {}
var queeID = [...Array(200).keys()].map(()=>alphanumberic(5,5))
for(i = 0; i < 20; i++){
	var previousQueeCheckInTime = new Date(faker.Date.between(faker.Date.past(4), faker.Date.past(1)));
	var servicedQueue = faker.random.number(10)
	randomizedData[alphanumberic(3,2)] = {
		name: faker.Lorem.sentence(),
		announce: faker.Lorem.sentence(),
		chat: [...Array(1+faker.random.number(19)).keys()]
			.reduce((acc)=>({
				...acc,
				[faker.Helpers.randomize(queeID)]:[...Array(1+faker.random.number(9)).keys()].map(() => ({
					timestamp:faker.Date.between(faker.Date.recent(2), faker.Date.recent(0)),
					message:faker.Lorem.sentences(2),
					sender:faker.Helpers.randomize(["quer","quee"])
				})).sort((chatObj1, chatObj2)=>(new Date(chatObj2.timestamp) < new Date(chatObj1.timestamp)))
			}),{}),
		queue:  faker.Helpers.shuffle(queeID).slice(0,20).map((eachQueeID, index)=>{
			previousQueeCheckInTime = (new Date(1000+faker.random.number(7000)+Number(previousQueeCheckInTime)))
			return {
				queeID: eachQueeID,
				checkInTimestamp:previousQueeCheckInTime,
				serviceTime:index < servicedQueue?faker.random.number(60):-1,
			}
		})
	}
}
console.log(JSON.stringify(randomizedData, null, "  "));
