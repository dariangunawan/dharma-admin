import React, { useState } from "react"
import { Button, Card, message, Modal, Table, Upload } from "antd"
import { storage } from "@/lib/firebase"
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage"
import axios from "axios"
const ModalFile = ({ orderId, refetch, files = [] }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [fileList, setFileList] = useState([])
  const showModal = () => {
    setIsModalOpen(true)
    setFileList(files)
  }
  const handleOk = () => {
    setIsModalOpen(false)
  }
  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const customRequest = ({ file, onSuccess, onError }) => {
    const storageRef = ref(storage, file.name)
    const uploadTask = uploadBytesResumable(storageRef, file)

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Handle progress, paused, and running state changes
        console.log("Upload is in progress...")
      },
      (error) => {
        onError(error)
        message.error(`${file.name} file upload failed.`)
        console.error("File upload failed:", error)
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
          onSuccess(null, uploadTask.snapshot)
          message.success(`${file.name} file uploaded successfully`)

          const newFileLists = [
            ...fileList,
            {
              key: file.uid,
              file_name: file.name,
              file_url: downloadURL,
            },
          ]
          setFileList(newFileLists)

          axios
            .put("/api/orders", { orderId, files: newFileLists })
            .then((response) => {
              refetch()
            })
        } catch (error) {
          onError(error)
          message.error(`${file.name} file upload failed.`)
          console.error("Failed to get download URL:", error)
        }
      }
    )
  }

  const props = {
    name: "file",
    customRequest,
    fileList: null,
    onChange(info) {
      console.log(info, "info")
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList)
      }
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`)
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`)
      }
    },
  }

  return (
    <>
      <Button type="primary" onClick={showModal} className="bg-green-800">
        Kirim Bukti
      </Button>
      <Modal
        title="Kirim Bukti"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={(_, { OkBtn, CancelBtn }) => (
          <>
            <Button onClick={handleCancel}>Tutup</Button>
          </>
        )}
      >
        <Card
          extra={
            <Upload {...props}>
              <Button type="primary" className="bg-blue-800">
                Upload File
              </Button>
            </Upload>
          }
        >
          <Table
            columns={[
              {
                title: "Nama File",
                dataIndex: "file_name",
                key: "file_name",
              },
              {
                title: "Aksi",
                dataIndex: "file_url",
                key: "file_url",
                render: (_, record) => {
                  return (
                    <Button
                      type="primary"
                      className="bg-blue-800"
                      onClick={() => window.open(record.file_url, "_blank")}
                    >
                      Download File
                    </Button>
                  )
                },
              },
            ]}
            dataSource={fileList}
          />
        </Card>
      </Modal>
    </>
  )
}
export default ModalFile
