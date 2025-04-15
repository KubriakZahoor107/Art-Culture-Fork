// controllers/geoController.js
import axios from "axios"

export const searchAddress = async (req, res, next) => {
  try {
    const query = req.query.q
    if (!query || query.length < 3) {
      return res.json([]) // Return an empty array if query too short
    }

    const response = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: {
          q: query,
          format: "jsonv2",
          addressdetails: 1,
          limit: 10,
        },
        headers: {
          "User-Agent": "ArtPlayUkraine/1.0 ",
        },
      },
    )

    const processedData = response.data.map((item) => {
      // Safely access item.address
      const address = item.address || {}
      // Extract fields with defaults if undefined
      const road = address.road || ""
      const house_number = address.house_number || ""
      const city = address.city || address.town || address.village || ""
      const state = address.state || ""
      const postcode = address.postcode || ""

      // Format the road name
      // Use startsWith (not startWith)
      const roadFormatted = road
        ? road.toLowerCase().startsWith("вулиця")
          ? road
          : `вулиця ${road}`
        : ""

      const formattedAddress = [
        roadFormatted,
        house_number ? house_number.toUpperCase() : "",
        city,
        state,
        postcode || "Нема індекса",
      ]
        .filter((part) => part)
        .join(", ")

      return {
        display_name: formattedAddress,
        lat: item.lat,
        lon: item.lon,
      }
    })

    // Return the data from Nominatim directly to the client
    res.json(processedData)
  } catch (error) {
    console.error("Error fetching address:", error)
    next(error)
  }
}

export const searchMuseumAddress = async (req, res, next) => {
  try {
    const query = req.query.q
    if (!query || query.length < 3) {
      return res.json([]) // Return an empty array if query too short
    }

    const response = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: {
          q: query,
          format: "jsonv2",
          addressdetails: 1,
          limit: 10,
        },
        headers: {
          "User-Agent": "ArtPlayUkraine/1.0 ",
        },
      },
    )

    const processedData = response.data.map((item) => {
      // Safely access item.address
      const address = item.address || {}
      // Extract fields with defaults if undefined
      const road = address.road || ""
      const house_number = address.house_number || ""
      const city = address.city || address.town || address.village || ""
      const state = address.state || ""
      const postcode = address.postcode || ""
      const country = address.country || ""

      // Format the road name
      // Use startsWith (not startWith)
      const roadFormatted = road
        ? road.toLowerCase().startsWith("вулиця")
          ? road
          : `вулиця ${road}`
        : ""

      return {
        country,
        state,
        city,
        road: roadFormatted,
        house_number: house_number.toUpperCase(),
        postcode,
        lat: item.lat,
        lon: item.lon,
      }
    })

    // Return the data from Nominatim directly to the client
    res.json(processedData)
  } catch (error) {
    console.error("Error fetching address:", error)
    next(error)
  }
}
