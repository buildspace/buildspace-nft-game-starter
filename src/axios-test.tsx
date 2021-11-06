import Axios from 'axios';

type Company = {
    name: string
    start: number
    end: number
    buzzword?: string
  }

  let to: Company[] = []

  const getCompanyName = async () => {
    let name_data = await Axios.get("https://random-data-api.com/api/company/random_company");
    let cName: string = name_data.data.business_name
    return cName;}

  const generateCompany = async () => {for (let i=0; i < 20; i++) {
    function randInt(min: number, max: number) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1) + min)
    }

    let cName = await getCompanyName()
    let startVal = randInt(1990, 2003);
    let endVal = startVal + randInt(1, 18)

    if (endVal > 2021) {
      endVal = 2021
    } 
    
    let company: Company = {name: cName, start: startVal, end: endVal}

    to = [...to, company]
}

let failures = to.filter((company: Company) => (company.end - company.start <= 3))
    console.table(to)
    console.log("%c Failures:", "color: orange; font-weight:bold;", failures)

}