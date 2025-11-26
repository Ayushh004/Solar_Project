const baseUrl = import.meta.env.VITE_API_BASE;

export async function getLiveData() {
  try {
    const response = await fetch(`${baseUrl}/fakedataRoutes/fake-data`);
    if (!response.ok) {
      throw new Error("Failed to fetch live data");
    }
    return await response.json();
  } catch (error) {
    console.error("Error in getLiveData:", error);
    return null;
  }
}

export async function getHistoryData() {
  try {
    const response = await fetch(`${baseUrl}/historyRoutes/machines/history`);
    if (!response.ok) {
      throw new Error("Failed to fetch history data");
    }
    return await response.json();
  } catch (error) {
    console.error("Error in getHistoryData:", error);
    return [];
  }
}
