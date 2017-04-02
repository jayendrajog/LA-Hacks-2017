import org.openkinect.processing.*;
import org.openkinect.freenect.*;
import org.openkinect.freenect2.*;
import java.lang.*;
import java.io.FileInputStream;
import com.microsoft.azure.storage.*;
import com.microsoft.azure.storage.blob.*;

//import com.microsoft.azure.storage.blob.*;

public Kinect2 kinect;
public long count=0;
public long startT=System.currentTimeMillis();
public long time=0;
//connecting to azure
public CloudBlobContainer container;
public String storageConnectionString =
    "DefaultEndpointsProtocol=https;AccountName=lahacksimages;AccountKey=RpiP3lmArIuKRmqNyIil397g8uUMeLhKuNmWIFjF0WJEG2RLhS1VuqhsVsOidG+lgrOwDjaBlyZj1mcU2KbCZQ==;EndpointSuffix=core.windows.net";
    
void connect(long count)
 {
   try{
        // Retrieve storage account from connection-string.
        CloudStorageAccount storageAccount = CloudStorageAccount.parse(storageConnectionString);
    
        // Create the blob client.
        CloudBlobClient blobClient = storageAccount.createCloudBlobClient();
    
        // Get a reference to a container.
        // The container name must be lower case
        container = blobClient.getContainerReference("classphotos");
    
        // Create the container if it does not exist.
        container.createIfNotExists();
         // Create a permissions object
      BlobContainerPermissions containerPermissions = new BlobContainerPermissions();

    // Include public access in the permissions object
    containerPermissions.setPublicAccess(BlobContainerPublicAccessType.CONTAINER);

    // Set the permissions on the container
    container.uploadPermissions(containerPermissions);
    String filePath = "C:\\Users\\Sam\\Desktop\\kinectPhoto\\photo.jpg";//"C:\\Users\\Sam\\Desktop\\kinectPhoto\\" + nameOfPhoto+ ".jpg";

    // Create or overwrite the "myimage.jpg" blob with contents from a local file.
    CloudBlockBlob blob = container.getBlockBlobReference("myimage"+count+".jpg");
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
  time=System.currentTimeMillis();
  //System.out.println("time: "+time);
  if((time-startT)>3000)
  {
    PImage img=kinect.getVideoImage();
    //image(img,0,0);
    String name="photo.jpg";
    //img.loadPixles();
    img.save(name);
    connect(count);
    count++;
    if(count>0)
    {
      count=0;
    }
    startT=time;
  }
}