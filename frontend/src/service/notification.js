import { useToast } from 'vuestic-ui'
const { init } = useToast()

export default {
  success(message) {
    init({
      message: message,
      color: 'success',
      duration: 3000,
    })
  },
}
