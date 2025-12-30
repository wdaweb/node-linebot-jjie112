import axios from 'axios'
import template from '../templates/card.json' with { type: 'json' }

export default async (event) => {
  try {
    const userInput = event.message.text.trim()

    const { data } = await axios.get(
      'https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWA-DAE48BFB-6E9F-4F50-8628-E05328A17443',
    )

    const value = data.records.location.find((event) => {
      return event.locationName.includes(userInput.replace('台', '臺'))
    })

    const City = value.locationName
    const Wx = value.weatherElement[0].time[0].parameter.parameterName
    const Pop = value.weatherElement[1].time[2].parameter.parameterName
    const MinT = value.weatherElement[2].time[2].parameter.parameterName
    const Ci = value.weatherElement[3].time[2].parameter.parameterName
    const MaxT = value.weatherElement[4].time[2].parameter.parameterName

    // 將資料帶入 Flex 卡片模板
    const bubble = JSON.parse(JSON.stringify(template))
    bubble.body.contents[0].text = City
    bubble.body.contents[1].contents[0].contents[1].text = Wx
    bubble.body.contents[1].contents[1].contents[1].text = MinT + '°C'
    bubble.body.contents[1].contents[2].contents[1].text = MaxT + '°C'
    bubble.body.contents[1].contents[3].contents[1].text = Pop + '%'
    bubble.body.contents[1].contents[4].contents[1].text = Ci

    const result = await event.reply({
      type: 'flex',
      altText: `${City}天氣預報`,
      contents: bubble,
    })

    if (result.message) {
      await event.reply('發生錯誤')
      console.log(result)
    }
  } catch (error) {
    console.log(error)
  }
}
