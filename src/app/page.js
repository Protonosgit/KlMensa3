import Image from 'next/image'
import { format, addDays, startOfWeek } from 'date-fns'
import { Star,LocateIcon } from 'lucide-react'
import { fetchFullSchedule } from '../../utils/api-bridge'
import styles from "./page.module.css";

export default async function Component() {
  const startDate = startOfWeek(new Date())

  const mealSchedule = await fetchFullSchedule()

  //console.dir(mealSchedule[0])


  const renderStarRating = (rating) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < Math.floor(rating._) ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-1 text-sm text-gray-600">{rating.$.amt}</span>
      </div>
    )
  }

  const renderImage = (meal) => {
    if(meal.mimg) {
      return <Image src={'https://www.mensa-kl.de/mimg/'+meal.mimg[0]?._} alt={'user_provided_image'} className="w-full h-48 object-cover" width={600} height={400} />
    } else{
      return <Image src={'/plate_placeholder.png'} alt={'image_not_found'} className="w-full h-48 object-cover" width={600} height={400} />
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-primary text-primary-foreground py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">KL Mensa </h1>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold text-center mb-8">
          Week of {format(startDate, 'MMMM d')} - {format(addDays(startDate, 6), 'MMMM d, yyyy')}
        </h2>

        {mealSchedule.map((day, index) => {
          return (
            <div key={index} className="mb-8">
              <h3 className="text-xl font-semibold mb-4 text-gray-700">{day?.$.date}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {day.meal?.filter(meal => meal.title_html).map((meal, mealIndex) => (
                  <div key={mealIndex} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
                    {renderImage(meal)}
                    <div className={styles.mealinfo}>
                    <p className="text-sm text-gray-600 mb-2">{meal.loc[0]?.$?.name}</p>
                      <h4  className={styles.mealtitle}>{meal.title_html}</h4>
                      <div className="mt-auto flex justify-between items-center pt-2 border-t border-gray-200">
                        <span className="text-sm font-semibold text-gray-500">${meal.$.price}</span>
                        {renderStarRating(meal.rating[0])}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </main>
      <footer className="bg-gray-200 py-4">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>&copy; 2024 Mensa KL operated by <a href="https://www.studierendenwerk-kaiserslautern.de/" className="text-primary hover:underline">Studierendenwerks Kaiserslautern.</a></p>
            <a href="https://www.mensa-kl.de/legal.html" className="text-primary hover:underline ml-2">Privacy Policy</a>
        </div>
      </footer>
    </div>
  )
}