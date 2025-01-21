# Use the latest Golang base image
FROM golang:latest AS builder

# Set the work directory in the container
WORKDIR /app

# Copy dependency files
COPY go.mod go.sum ./

# Install dependencies
RUN go mod download

# Copy source code
COPY . .

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -o main .

# Start a new build stage
FROM alpine:latest  

# Install certificates and time zone data
RUN apk --no-cache add ca-certificates tzdata

# Set the desired time zone
ENV TZ=Africa/Addis_Ababa

# Set work directory
WORKDIR /root/

# Copy the binary from the builder stage
COPY --from=builder /app/main .

# Expose port 8080
EXPOSE 8080

# Command to run the executable
CMD ["./main"]
