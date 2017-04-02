import org.openkinect.processing.*;
import org.openkinect.freenect.*;
import org.openkinect.freenect2.*;
import java.lang.*;
import java.io.FileInputStream;
import com.microsoft.azure.storage.*;
import com.microsoft.azure.storage.blob.*;
import java.sql.*;
//import com.mysql.*;

//import com.microsoft.azure.storage.blob.*;
java.sql.Connection myConn;
public Kinect2 kinect;
long count=0;
String name="";
//connecting to azure
public CloudBlobContainer container;
public String storageConnectionString =
    "DefaultEndpointsProtocol=https;AccountName=lahacksimages;AccountKey=RpiP3lmArIuKRmqNyIil397g8uUMeLhKuNmWIFjF0WJEG2RLhS1VuqhsVsOidG+lgrOwDjaBlyZj1mcU2KbCZQ==;EndpointSuffix=core.windows.net";
void connectDB()
{
  try {
            myConn = DriverManager.getConnection("tcp:lahacks2017jay.database.windows.net", "jayendra", "Password8");
            
            //myStmt.executeUpdate();
  }
  catch(Exception e)
  {
  }
}
void closeDBConn()
{
  try{
  myConn.close();
  }
  catch(Exception e)
  {
  }
}
void pushtoDB(String url)
{
  try{
    java.sql.Statement myStmt = myConn.createStatement();
    String insertSql = "INSERT INTO urls (url)" 
                    + " StandardCost, ListPrice, SellStartDate) VALUES (?,?,?,?,?,?);";
    //myStmt.executeUpdate(url);
  }
  catch(Exception e)
  {
  }
}
void connect(long count)
 {
   try{
        // Retrieve storage account from connection-string.
        CloudStorageAccount storageAccount = CloudStorageAccount.parse(storageConnectionString);
    
        // Create the blob client.
        CloudBlobClient blobClient = storageAccount.createCloudBlobClient();
    
        // Get a reference to a container.
        // The container name must be lower case
        container = blobClient.getContainerReference("userphotos");
    
        // Create the container if it does not exist.
        container.createIfNotExists();
         // Create a permissions object
      BlobContainerPermissions containerPermissions = new BlobContainerPermissions();

    // Include public access in the permissions object
    containerPermissions.setPublicAccess(BlobContainerPublicAccessType.CONTAINER);

    // Set the permissions on the container
    container.uploadPermissions(containerPermissions);
    String filePath = "C:\\Users\\Sam\\Desktop\\takeUserPhoto\\user"+count+".jpg";//"C:\\Users\\Sam\\Desktop\\kinectPhoto\\" + nameOfPhoto+ ".jpg";

    // Create or overwrite the "myimage.jpg" blob with contents from a local file.
    CloudBlockBlob blob = container.getBlockBlobReference("user"+count+".jpg");
    File source = new File(filePath);
    FileInputStream f= new FileInputStream(source);
    blob.upload(f, source.length());
   }
   catch(Exception e) {
   }
 }
void setup(){
  //connect();
  kinect=new Kinect2(this);
  kinect.initVideo();
  kinect.initDevice();
}

void draw(){
  //background(0);
  //System.out.println("startT: "+startT);
  //System.out.println("time: "+time);
  PImage img=kinect.getVideoImage();
   if (keyPressed) {
    
    if (key == ' ') {
    //image(img,0,0);
    count++;
   String name="user"+count+".jpg";
   //img.loadPixles();
   img.save(name);
   connect(count);
    }
   //image(img,0,0);
   
  }
  
}