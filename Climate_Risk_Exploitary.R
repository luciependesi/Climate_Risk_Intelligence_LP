# Outputs saved to folder: airbnb_regression_outputs
options(scipen=999) # prevent scientific notation

# load the dataset: File -> Import Dataset -> From Text(base)
#ARIMA modeling
library(forecast)

# Load climate data
ts_data <- ts(sensor_data$temperature, frequency=24)

# Fit ARIMA model
model <- auto.arima(ts_data)

# Forecast next 24 hours
forecast_values <- forecast(model, h=24)

plot(forecast_values)

#Random Forest implementation
library(randomForest)

# Train Random Forest model
rf_model <- randomForest(
  risk_level ~ temperature + humidity + rainfall + air_quality,
  data = climate_data,
  ntree = 500
)

# Predict risk levels
predictions <- predict(rf_model, newdata = climate_data)

# handling missing
# Replace missing temperature values with mean
sensor_data$temperature[is.na(sensor_data$temperature)] <- 
  mean(sensor_data$temperature, na.rm = TRUE)
#outlier detection
boxplot(sensor_data$temperature,
        main="Temperature Distribution",
        ylab="Temperature (°C)")
#R visualization
plot(sensor_data$timestamp,
     sensor_data$temperature,
     type="l",
     xlab="Time",
     ylab="Temperature (°C)",
     main="Temperature Trends Over Time")
#correlation analysis
cor(sensor_data[,c("temperature","humidity","rainfall","air_quality_index")])
