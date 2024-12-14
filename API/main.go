package main

import (
	"log"
	"aastu_lib/router"
	"aastu_lib/data"
	"aastu_lib/config"

	"github.com/gin-gonic/gin"

)

func main(){
	// client, err := config.Init()
	// if err != nil {
	// 	log.Fatal(err)
	// }
	
	// // data.SetUserCollection(client)
	// // data.SetBookCollection(client)
	r := gin.Default()
	router.SetupBookRouter(r)
	router.SetupUserRouter(r)

	r.Run()	
}